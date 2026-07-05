import { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import ViewShot from 'react-native-view-shot';
import * as ExpoSharing from 'expo-sharing';
import { Colors } from '@/constants/colors';
import { RoastResult } from '@/lib/types';
import ResultCard from '@/components/ResultCard';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const params = useLocalSearchParams<{ data: string }>();
  const result: RoastResult = JSON.parse(params.data);
  const cardRef = useRef<ViewShot>(null);

  const scoreAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setDisplayScore(Math.round((result.score * current) / steps));
      if (current >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  async function handleShare() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const uri = await cardRef.current?.capture?.();
      if (!uri) throw new Error('Could not capture card');
      if (await ExpoSharing.isAvailableAsync()) {
        await ExpoSharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your roast!',
        });
      } else {
        await Share.share({ message: `I got ${result.score}/10 on Outfit Roaster! "${result.styleLabel}" 😂 Get roasted at outfitroaster.app` });
      }
    } catch {
      Alert.alert('Error', 'Could not share the card. Try saving it first.');
    }
  }

  async function handleSave() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { granted } = await MediaLibrary.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission needed', 'Allow photo library access to save your roast card.');
      return;
    }
    try {
      const uri = await cardRef.current?.capture?.();
      if (!uri) throw new Error();
      await MediaLibrary.saveToLibraryAsync(uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved! 📸', 'Your roast card has been saved to your photos.');
    } catch {
      Alert.alert('Error', 'Could not save the card.');
    }
  }

  const gradient: [string, string] =
    result.dominantColors?.length >= 2
      ? [result.dominantColors[0], result.dominantColors[1]]
      : ['#FF4757', '#FF6B35'];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D0D1A', '#1A1A2E']} style={StyleSheet.absoluteFill} />

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Score headline */}
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Your score</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNumber}>{displayScore}</Text>
              <Text style={styles.scoreOf}>/10</Text>
            </View>
          </View>

          {/* Style label */}
          <Text style={styles.styleLabel}>{result.styleLabel}</Text>

          {/* Shareable card */}
          <ViewShot
            ref={cardRef}
            options={{ format: 'png', quality: 1.0 }}
            style={styles.cardWrapper}
          >
            <ResultCard result={result} gradient={gradient} />
          </ViewShot>

          {/* Roast text (outside card too for readability) */}
          <View style={styles.roastBox}>
            <Text style={styles.roastIcon}>🎤</Text>
            <Text style={styles.roastText}>"{result.roast}"</Text>
          </View>

          {/* Tip */}
          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Style Tip</Text>
              <Text style={styles.tipText}>{result.tip}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
              <LinearGradient
                colors={['#FF4757', '#FF6B35']}
                style={styles.shareBtnInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.shareBtnText}>Share 📤</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.iconBtnText}>💾</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => { router.back(); }}
              activeOpacity={0.85}
            >
              <Text style={styles.iconBtnText}>🔄</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  closeBtn: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.darkCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 16, color: Colors.text, fontWeight: '600' },
  scroll: { paddingTop: 100, paddingHorizontal: 20, paddingBottom: 48 },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: { fontSize: 16, color: Colors.textMuted },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.gold + '22',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.gold + '44',
  },
  scoreNumber: { fontSize: 36, fontWeight: '900', color: Colors.gold },
  scoreOf: { fontSize: 18, fontWeight: '600', color: Colors.gold + '99', marginBottom: 5, marginLeft: 2 },
  styleLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 24,
    lineHeight: 28,
  },
  cardWrapper: { borderRadius: 24, overflow: 'hidden', marginBottom: 20 },
  roastBox: {
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roastIcon: { fontSize: 24 },
  roastText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  tipBox: {
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipIcon: { fontSize: 24 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  tipText: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  actionRow: { flexDirection: 'row', gap: 10 },
  shareBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  shareBtnInner: { paddingVertical: 17, alignItems: 'center' },
  shareBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  iconBtn: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.darkCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBtnText: { fontSize: 22 },
});
