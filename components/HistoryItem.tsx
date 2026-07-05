import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, ToneColors } from '@/constants/colors';
import { RoastResult } from '@/lib/types';

interface Props {
  item: RoastResult;
  onPress: () => void;
}

const TONE_EMOJI = { brutal: '🔥', ironic: '😏', constructive: '🌱' };

export default function HistoryItem({ item, onPress }: Props) {
  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const toneColor = ToneColors[item.tone];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.card}>
        {/* Thumbnail */}
        <View style={styles.thumbWrapper}>
          <Image source={{ uri: item.imageUri }} style={styles.thumb} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.scoreBubble}>
            <Text style={styles.scoreText}>{item.score}/10</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.styleLabel} numberOfLines={2}>{item.styleLabel}</Text>
          <Text style={styles.roastPreview} numberOfLines={2}>"{item.roast}"</Text>
          <View style={styles.meta}>
            <View style={[styles.tonePill, { borderColor: toneColor + '44', backgroundColor: toneColor + '18' }]}>
              <Text style={[styles.toneText, { color: toneColor }]}>
                {TONE_EMOJI[item.tone]} {item.tone}
              </Text>
            </View>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  thumbWrapper: { width: 90, position: 'relative' },
  thumb: { width: 90, height: 110 },
  scoreBubble: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: Colors.gold + 'EE',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scoreText: { fontSize: 11, fontWeight: '800', color: '#000' },
  info: { flex: 1, padding: 12, gap: 4 },
  styleLabel: { fontSize: 14, fontWeight: '700', color: Colors.text, lineHeight: 18 },
  roastPreview: { fontSize: 12, color: Colors.textMuted, lineHeight: 16, fontStyle: 'italic' },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  tonePill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  toneText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  date: { fontSize: 11, color: Colors.textMuted },
});
