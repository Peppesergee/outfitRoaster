import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/lib/LanguageContext';

export default function LoadingScreen() {
  const { t } = useLanguage();
  const messages = t.loadingMessages as readonly string[];
  const [msgIndex, setMsgIndex] = useState(0);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const msgFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    const msgInterval = setInterval(() => {
      Animated.timing(msgFadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setMsgIndex((i) => (i + 1) % messages.length);
        Animated.timing(msgFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 2200);

    return () => clearInterval(msgInterval);
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D0D1A', '#1A1A2E', '#0D0D1A']} style={StyleSheet.absoluteFill} />
      <Animated.Text style={[styles.emoji, { transform: [{ scale: pulseAnim }] }]}>🔥</Animated.Text>
      <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]}>
        <LinearGradient colors={['#FF4757', '#FF6B35', '#FF475700']} style={styles.ringGradient} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
      </Animated.View>
      <Text style={styles.title}>{t.loadingTitle}</Text>
      <Animated.Text style={[styles.message, { opacity: msgFadeAnim }]}>
        {messages[msgIndex]}
      </Animated.Text>
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => <LoadingDot key={i} delay={i * 200} />)}
      </View>
    </View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    }, delay);
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  return <Animated.View style={[styles.dot, { opacity }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark },
  emoji: { fontSize: 72, marginBottom: 40, zIndex: 1 },
  ring: { position: 'absolute', width: 160, height: 160, borderRadius: 80, overflow: 'hidden', opacity: 0.4 },
  ringGradient: { width: '100%', height: '100%' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 16, textAlign: 'center' },
  message: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 40, marginBottom: 40, lineHeight: 24 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});
