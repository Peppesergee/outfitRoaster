import { View, Text, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';
import { useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const TRACK_WIDTH = width - 40 - 40;
const THUMB_SIZE = 28;

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const LABELS = ['Gentle', 'Mild', 'Medium', 'Sharp', 'Devastating'];

export default function IntensitySlider({ value, onChange }: Props) {
  const initialX = ((value - 1) / 9) * TRACK_WIDTH;
  const thumbX = useRef(new Animated.Value(initialX)).current;
  // Track the committed position so each new gesture starts from the right place
  const positionRef = useRef(initialX);
  const [displayValue, setDisplayValue] = useState(value);
  const lastHapticRef = useRef(value);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Haptics.selectionAsync();
    },
    onPanResponderMove: (_, gestureState) => {
      const clampedX = Math.max(0, Math.min(TRACK_WIDTH, positionRef.current + gestureState.dx));
      thumbX.setValue(clampedX);
      const newValue = Math.round((clampedX / TRACK_WIDTH) * 9) + 1;
      setDisplayValue(newValue);
      if (newValue !== lastHapticRef.current) {
        Haptics.selectionAsync();
        lastHapticRef.current = newValue;
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const clampedX = Math.max(0, Math.min(TRACK_WIDTH, positionRef.current + gestureState.dx));
      const newValue = Math.round((clampedX / TRACK_WIDTH) * 9) + 1;
      const snappedX = ((newValue - 1) / 9) * TRACK_WIDTH;
      positionRef.current = snappedX;
      Animated.spring(thumbX, {
        toValue: snappedX,
        useNativeDriver: false,
        tension: 200,
        friction: 15,
      }).start();
      onChange(newValue);
      setDisplayValue(newValue);
    },
  });

  const labelIndex = Math.min(4, Math.floor(((displayValue - 1) / 9) * 5));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.labelLeft}>Gentle</Text>
        <View style={styles.valuePill}>
          <Text style={styles.valueText}>{LABELS[labelIndex]}</Text>
        </View>
        <Text style={styles.labelRight}>Devastating</Text>
      </View>
      <View style={styles.track} {...panResponder.panHandlers}>
        <LinearGradient
          colors={['#22C55E', '#FFD700', '#FF6B35', '#FF4757']}
          style={styles.trackGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbX }] }]}>
          <Text style={styles.thumbValue}>{displayValue}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelLeft: { fontSize: 12, color: Colors.textMuted },
  labelRight: { fontSize: 12, color: Colors.textMuted },
  valuePill: {
    backgroundColor: Colors.darkCard,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  valueText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  track: {
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  trackGradient: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: THUMB_SIZE / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbValue: { fontSize: 11, fontWeight: '800', color: Colors.dark },
});
