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

const { width } = Dimensions.get('window');

const TONES: { key: RoastTone; label: string; emoji: string; desc: string; color: string }[] = [
  {
    key: 'brutal',
    label: 'Brutal',
    emoji: '🔥',
    desc: 'No mercy. The full, unfiltered truth.',
    color: Colors.brutal,
  },
  {
    key: 'ironic',
    label: 'Ironic',
    emoji: '😏',
    desc: 'Sharp, witty, deliciously sarcastic.',
    color: Colors.ironic,
  },
  {
    key: 'constructive',
    label: 'Constructive',
    emoji: '🌱',
    desc: 'Honest feedback with a hopeful spin.',
    color: Colors.constructive,
  },
];

export default function Onboarding() {
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

  return (
    <LinearGradient colors={['#0D0D1A', '#1A1A2E', '#0D0D1A']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Step indicator */}
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.dot, step === i && styles.dotActive]}
              />
            ))}
          </View>

          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {step === 0 && <SplashStep onNext={goToNext} />}
            {step === 1 && (
              <ToneStep tone={tone} onSelect={(t) => { setTone(t); Haptics.selectionAsync(); }} onNext={goToNext} />
            )}
            {step === 2 && (
              <UsernameStep
                username={username}
                onChange={setUsername}
                tone={tone}
                onFinish={finish}
              />
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function SplashStep({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.bigEmoji}>👗</Text>
      <Text style={styles.title}>Outfit Roaster</Text>
      <Text style={styles.subtitle}>Your AI fashion judge.{'\n'}Brutal. Fun. Shareable.</Text>
      <Text style={styles.body}>
        Take a photo of your outfit and let AI tell you the truth — the whole truth, nothing but the
        truth.
      </Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.85}>
        <LinearGradient colors={['#FF4757', '#FF6B35']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.btnText}>Let's go 🔥</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function ToneStep({
  tone,
  onSelect,
  onNext,
}: {
  tone: RoastTone;
  onSelect: (t: RoastTone) => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepLabel}>Step 1 of 2</Text>
      <Text style={styles.title}>Choose your roast tone</Text>
      <Text style={styles.body}>How brutal should the AI be?</Text>
      <View style={styles.toneGrid}>
        {TONES.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => onSelect(t.key)}
            activeOpacity={0.85}
            style={[
              styles.toneCard,
              tone === t.key && { borderColor: t.color, borderWidth: 2 },
            ]}
          >
            {tone === t.key && (
              <LinearGradient
                colors={[t.color + '22', t.color + '08']}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
            )}
            <Text style={styles.toneEmoji}>{t.emoji}</Text>
            <Text style={[styles.toneLabel, tone === t.key && { color: t.color }]}>{t.label}</Text>
            <Text style={styles.toneDesc}>{t.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.85}>
        <LinearGradient colors={['#FF4757', '#FF6B35']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.btnText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function UsernameStep({
  username,
  onChange,
  tone,
  onFinish,
}: {
  username: string;
  onChange: (v: string) => void;
  tone: RoastTone;
  onFinish: () => void;
}) {
  const toneData = TONES.find((t) => t.key === tone)!;
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepLabel}>Step 2 of 2</Text>
      <Text style={styles.title}>What's your name?</Text>
      <Text style={styles.body}>
        We'll personalize your roasts.{'\n'}
        <Text style={styles.textMuted}>(Optional — skip if you're shy)</Text>
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Your name or nickname"
          placeholderTextColor={Colors.textMuted}
          value={username}
          onChangeText={onChange}
          maxLength={20}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={onFinish}
        />
      </View>
      <TouchableOpacity style={styles.primaryBtn} onPress={onFinish} activeOpacity={0.85}>
        <LinearGradient
          colors={[toneData.color, toneData.color + 'BB']}
          style={styles.btnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.btnText}>
            Start getting roasted {toneData.emoji}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      {username.length === 0 && (
        <TouchableOpacity onPress={onFinish} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  input: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 17,
    color: Colors.text,
  },
  primaryBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  btnGradient: { paddingVertical: 18, alignItems: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  skipBtn: { marginTop: 16, padding: 8 },
  skipText: { fontSize: 14, color: Colors.textMuted },
});
