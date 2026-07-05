import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { submitRoast } from '@/lib/api';
import {
  getOnboarding,
  getDailyRoastCount,
  incrementDailyRoastCount,
  updateStreak,
  addRoastToHistory,
  getStreak,
} from '@/lib/storage';
import { Colors, ToneColors } from '@/constants/colors';
import { RoastLanguage, RoastTone, RoastResult } from '@/lib/types';
import IntensitySlider from '@/components/IntensitySlider';
import LoadingScreen from '@/components/LoadingScreen';

const { width } = Dimensions.get('window');
const FREE_DAILY_LIMIT = 3;

type ScreenState = 'home' | 'preview' | 'loading';

export default function HomeScreen() {
  const [screenState, setScreenState] = useState<ScreenState>('home');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tone, setTone] = useState<RoastTone>('ironic');
  const [intensity, setIntensity] = useState(5);
  const [language, setLanguage] = useState<RoastLanguage>('en');
  const [dailyCount, setDailyCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [username, setUsername] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const onboarding = await getOnboarding();
        if (onboarding?.tone) setTone(onboarding.tone);
        if (onboarding?.username) setUsername(onboarding.username);
        const count = await getDailyRoastCount();
        setDailyCount(count);
        const s = await getStreak();
        setStreak(s);
      })();
    }, [])
  );

  async function pickImage(source: 'camera' | 'gallery') {
    let result: ImagePicker.ImagePickerResult;
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Camera needed', 'Please allow camera access in Settings.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: true,
        aspect: [3, 4],
      });
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Gallery needed', 'Please allow photo library access in Settings.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: true,
        aspect: [3, 4],
      });
    }
    if (!result.canceled && result.assets[0]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImageUri(result.assets[0].uri);
      setScreenState('preview');
    }
  }

  async function handleRoast() {
    if (!imageUri) return;
    if (dailyCount >= FREE_DAILY_LIMIT) {
      Alert.alert(
        'Daily limit reached 🔥',
        `Free users get ${FREE_DAILY_LIMIT} roasts per day. Upgrade to Roaster Pro for unlimited roasts!`,
        [{ text: 'OK' }]
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setScreenState('loading');

    try {
      const compressed = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      const base64 = compressed.base64!;

      const response = await submitRoast({
        image: base64,
        tone,
        intensity,
        language,
        deviceId: 'device-placeholder',
      });

      if (!response.success || !response.data) {
        throw new Error(response.error ?? 'Roast failed');
      }

      const result: RoastResult = {
        id: Date.now().toString(),
        ...response.data,
        imageUri,
        tone,
        intensity,
        language,
        createdAt: new Date().toISOString(),
      };

      await addRoastToHistory(result);
      const newCount = await incrementDailyRoastCount();
      setDailyCount(newCount);
      await updateStreak();

      router.push({ pathname: '/result', params: { data: JSON.stringify(result) } });
      setScreenState('home');
      setImageUri(null);
    } catch (err: any) {
      setScreenState('preview');
      Alert.alert('Oops', err.message ?? 'Something went wrong. Try again!');
    }
  }

  if (screenState === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D0D1A', '#16213E']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {username ? `Hey, ${username} 👋` : 'Hey there 👋'}
            </Text>
            <Text style={styles.headerTitle}>Outfit Roaster</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>{streak}</Text>
          </View>
        </View>

        {/* Daily limit bar */}
        <View style={styles.limitBar}>
          <Text style={styles.limitText}>
            {FREE_DAILY_LIMIT - dailyCount} roast{FREE_DAILY_LIMIT - dailyCount !== 1 ? 's' : ''} left today
          </Text>
          <View style={styles.limitDots}>
            {Array.from({ length: FREE_DAILY_LIMIT }).map((_, i) => (
              <View key={i} style={[styles.limitDot, i < dailyCount && styles.limitDotUsed]} />
            ))}
          </View>
        </View>

        {screenState === 'home' && (
          <>
            {/* Camera zone */}
            <View style={styles.cameraZone}>
              <View style={styles.cameraPlaceholder}>
                <Ionicons name="shirt-outline" size={64} color={Colors.textMuted} />
                <Text style={styles.cameraLabel}>Your outfit goes here</Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnPrimary]}
                onPress={() => pickImage('camera')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#FF4757', '#FF6B35']}
                  style={styles.actionBtnInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="camera" size={28} color="#fff" />
                  <Text style={styles.actionBtnText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnSecondary]}
                onPress={() => pickImage('gallery')}
                activeOpacity={0.85}
              >
                <Ionicons name="images-outline" size={28} color={Colors.text} />
                <Text style={styles.actionBtnText}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.hint}>
              Point the camera at your full outfit for the best roast
            </Text>
          </>
        )}

        {screenState === 'preview' && imageUri && (
          <View style={styles.previewContainer}>
            {/* Preview image */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={() => { setImageUri(null); setScreenState('home'); }}
              >
                <Ionicons name="close-circle" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Tone selector */}
            <Text style={styles.sectionLabel}>Roast Tone</Text>
            <View style={styles.toneRow}>
              {(['brutal', 'ironic', 'constructive'] as RoastTone[]).map((t) => {
                const labels = { brutal: '🔥 Brutal', ironic: '😏 Ironic', constructive: '🌱 Kind' };
                const isActive = tone === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.toneChip,
                      isActive && { backgroundColor: ToneColors[t] + '22', borderColor: ToneColors[t] },
                    ]}
                    onPress={() => { setTone(t); Haptics.selectionAsync(); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toneChipText, isActive && { color: ToneColors[t] }]}>
                      {labels[t]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Language toggle */}
            <Text style={styles.sectionLabel}>Language</Text>
            <View style={styles.langRow}>
              {(['en', 'it'] as RoastLanguage[]).map((lang) => {
                const labels = { en: '🇬🇧 English', it: '🇮🇹 Italiano' };
                const isActive = language === lang;
                return (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.toneChip, isActive && styles.langChipActive]}
                    onPress={() => { setLanguage(lang); Haptics.selectionAsync(); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toneChipText, isActive && styles.langChipTextActive]}>
                      {labels[lang]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Intensity slider */}
            <Text style={styles.sectionLabel}>Intensity</Text>
            <IntensitySlider value={intensity} onChange={setIntensity} />

            {/* Roast button */}
            <TouchableOpacity
              style={styles.roastBtn}
              onPress={handleRoast}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FF4757', '#FF6B35']}
                style={styles.roastBtnInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.roastBtnText}>Roast Me 🔥</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  scroll: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: { fontSize: 14, color: Colors.textMuted, marginBottom: 2 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.text },
  streakBadge: {
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakEmoji: { fontSize: 16 },
  streakCount: { fontSize: 18, fontWeight: '800', color: Colors.text },
  limitBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  limitText: { fontSize: 13, color: Colors.textMuted },
  limitDots: { flexDirection: 'row', gap: 6 },
  limitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary + '33',
    borderWidth: 1,
    borderColor: Colors.primary + '66',
  },
  limitDotUsed: { backgroundColor: Colors.primary },
  cameraZone: { marginBottom: 24 },
  cameraPlaceholder: {
    height: 280,
    backgroundColor: Colors.darkCard,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  cameraLabel: { fontSize: 16, color: Colors.textMuted },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  actionBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  actionBtnPrimary: {},
  actionBtnSecondary: {
    backgroundColor: Colors.darkCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },
  actionBtnInner: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: Colors.text },
  hint: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  previewContainer: { gap: 0 },
  imageWrapper: { position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 24 },
  previewImage: { width: '100%', height: 320, borderRadius: 24 },
  retakeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
  toneRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  langRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  langChipActive: { backgroundColor: Colors.primary + '22', borderColor: Colors.primary },
  langChipTextActive: { color: Colors.primary },
  toneChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.darkCard,
    alignItems: 'center',
  },
  toneChipText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  roastBtn: { borderRadius: 18, overflow: 'hidden', marginTop: 8 },
  roastBtnInner: { paddingVertical: 20, alignItems: 'center' },
  roastBtnText: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});
