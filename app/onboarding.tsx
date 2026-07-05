import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { saveOnboarding } from '@/lib/storage';
import { RoastTone } from '@/lib/types';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/lib/LanguageContext';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const { language, t, setLanguage } = useLanguage();
  const [step, setStep] = useState(0);
  const [tone, setTone] = useState<RoastTone>('ironic');
  const [username, setUsername] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  function goToNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start(() => setStep((s) => s + 1));
  }

  async function finish() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await saveOnboarding({ tone, username: username.trim() || undefined, completed: true });
    router.replace('/(main)');
  }

  const tones = [
    { key: 'brutal' as RoastTone, label: t.toneBrutalLabel, emoji: '🔥', desc: t.toneBrutalDesc, color: Colors.brutal },
    { key: 'ironic' as RoastTone, label: t.toneIronicLabel, emoji: '😏', desc: t.toneIronicDesc, color: Colors.ironic },
    { key: 'constructive' as RoastTone, label: t.toneConstructiveLabel, emoji: '🌱', desc: t.toneConstructiveDesc, color: Colors.constructive },
  ];

  return (
    <LinearGradient colors={['#0D0D1A', '#1A1A2E', '#0D0D1A']} style={styles.container}>
      {/* Language toggle */}
      <TouchableOpacity
        style={styles.langBtn}
        onPress={() => { setLanguage(language === 'en' ? 'it' : 'en'); Haptics.selectionAsync(); }}
        activeOpacity={0.8}
      >
        <Text style={styles.langFlag}>{language === 'en' ? '🇬🇧' : '🇮🇹'}</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
            ))}
          </View>

          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {step === 0 && (
              <View style={styles.stepContainer}>
                <Text style={styles.bigEmoji}>👗</Text>
                <Text style={styles.title}>{t.appName}</Text>
                <Text style={styles.subtitle}>{t.splashSubtitle}</Text>
                <Text style={styles.body}>{t.splashBody}</Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={goToNext} activeOpacity={0.85}>
                  <LinearGradient colors={['#FF4757', '#FF6B35']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.btnText}>{t.letsGo}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepLabel}>{t.step1of2}</Text>
                <Text style={styles.title}>{t.chooseTone}</Text>
                <Text style={styles.body}>{t.howBrutal}</Text>
                <View style={styles.toneGrid}>
                  {tones.map((toneOpt) => (
                    <TouchableOpacity
                      key={toneOpt.key}
                      onPress={() => { setTone(toneOpt.key); Haptics.selectionAsync(); }}
                      activeOpacity={0.85}
                      style={[
                        styles.toneCard,
                        tone === toneOpt.key && { borderColor: toneOpt.color, borderWidth: 2 },
                      ]}
                    >
                      {tone === toneOpt.key && (
                        <LinearGradient
                          colors={[toneOpt.color + '22', toneOpt.color + '08']}
                          style={StyleSheet.absoluteFill}
                          borderRadius={16}
                        />
                      )}
                      <Text style={styles.toneEmoji}>{toneOpt.emoji}</Text>
                      <Text style={[styles.toneLabel, tone === toneOpt.key && { color: toneOpt.color }]}>
                        {toneOpt.label}
                      </Text>
                      <Text style={styles.toneDesc}>{toneOpt.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.primaryBtn} onPress={goToNext} activeOpacity={0.85}>
                  <LinearGradient colors={['#FF4757', '#FF6B35']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.btnText}>{t.continueBtn}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepLabel}>{t.step2of2}</Text>
                <Text style={styles.title}>{t.whatsYourName}</Text>
                <Text style={styles.body}>
                  {t.nameBody}{'\n'}
                  <Text style={styles.textMuted}>{t.nameOptional}</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={t.namePlaceholder}
                    placeholderTextColor={Colors.textMuted}
                    value={username}
                    onChangeText={setUsername}
                    maxLength={20}
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={finish}
                  />
                </View>
                <TouchableOpacity style={styles.primaryBtn} onPress={finish} activeOpacity={0.85}>
                  <LinearGradient
                    colors={[Colors.ironic, Colors.ironic + 'BB']}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.btnText}>{t.startRoasted} 😏</Text>
                  </LinearGradient>
                </TouchableOpacity>
                {username.length === 0 && (
                  <TouchableOpacity onPress={finish} style={styles.skipBtn}>
                    <Text style={styles.skipText}>{t.skipForNow}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  langBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langFlag: { fontSize: 20 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32, marginTop: 60 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary, width: 24 },
  content: { flex: 1 },
  stepContainer: { alignItems: 'center', paddingBottom: 40 },
  bigEmoji: { fontSize: 80, marginBottom: 16 },
  stepLabel: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 32, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 12, lineHeight: 38 },
  subtitle: { fontSize: 18, color: Colors.textMuted, textAlign: 'center', marginBottom: 16, lineHeight: 26 },
  body: { fontSize: 15, color: Colors.textMuted, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  textMuted: { color: Colors.textMuted, fontSize: 13 },
  toneGrid: { width: '100%', gap: 12, marginBottom: 32 },
  toneCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    overflow: 'hidden',
  },
  toneEmoji: { fontSize: 36, marginBottom: 8 },
  toneLabel: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  toneDesc: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  inputWrapper: {
    width: '100%',
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  input: { paddingHorizontal: 20, paddingVertical: 18, fontSize: 17, color: Colors.text },
  primaryBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  btnGradient: { paddingVertical: 18, alignItems: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  skipBtn: { marginTop: 16, padding: 8 },
  skipText: { fontSize: 14, color: Colors.textMuted },
});
