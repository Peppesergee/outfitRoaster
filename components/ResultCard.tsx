import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { RoastResult } from '@/lib/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface Props {
  result: RoastResult;
  gradient: [string, string];
}

const TONE_LABELS = {
  brutal: '🔥 BRUTAL',
  ironic: '😏 IRONIC',
  constructive: '🌱 CONSTRUCTIVE',
};

export default function ResultCard({ result, gradient }: Props) {
  return (
    <View style={styles.card}>
      {/* Background image */}
      <Image source={{ uri: result.imageUri }} style={styles.bgImage} resizeMode="cover" />

      {/* Gradient overlay — kept light so the outfit image shows through */}
      <LinearGradient
        colors={[gradient[0] + '22', gradient[1] + '44', '#0D0D1ACC']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      />

      {/* Content */}
      <View style={styles.cardContent}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.toneChip}>
            <Text style={styles.toneChipText}>{TONE_LABELS[result.tone]}</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{result.score}</Text>
            <Text style={styles.scoreSlash}>/10</Text>
          </View>
        </View>

        {/* Spacer pushes content to bottom */}
        <View style={{ flex: 1 }} />

        {/* Style label */}
        <View style={styles.labelBadge}>
          <Text style={styles.labelEmoji}>{result.emoji}</Text>
          <Text style={styles.labelText}>{result.styleLabel}</Text>
        </View>

        {/* Roast */}
        <Text style={styles.roastText} numberOfLines={4}>
          "{result.roast}"
        </Text>

        {/* Watermark */}
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>👗 OutfitRoaster</Text>
          <Text style={styles.watermarkCta}>Get roasted → outfitroaster.app</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_WIDTH * 1.4,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.dark,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  toneChip: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  toneChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  scoreCircle: {
    backgroundColor: Colors.gold + 'DD',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreNumber: { fontSize: 26, fontWeight: '900', color: '#000' },
  scoreSlash: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 3 },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  labelEmoji: { fontSize: 20 },
  labelText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    flexShrink: 1,
  },
  roastText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  watermark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 12,
  },
  watermarkText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  watermarkCta: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
});
