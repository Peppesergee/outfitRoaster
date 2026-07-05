export const Colors = {
  primary: '#FF4757',
  secondary: '#FF6B35',
  gold: '#FFD700',
  dark: '#0D0D1A',
  darkCard: '#1A1A2E',
  surface: '#16213E',
  text: '#FFFFFF',
  textMuted: '#8A8AA0',
  textDark: '#1A1A2E',
  brutal: '#FF4757',
  ironic: '#A855F7',
  constructive: '#22C55E',
  border: 'rgba(255,255,255,0.08)',
  overlay: 'rgba(0,0,0,0.75)',
  cardShadow: 'rgba(0,0,0,0.5)',
} as const;

export const ToneColors: Record<string, string> = {
  brutal: Colors.brutal,
  ironic: Colors.ironic,
  constructive: Colors.constructive,
};

export const ToneGradients: Record<string, [string, string]> = {
  brutal: ['#FF4757', '#C0392B'],
  ironic: ['#A855F7', '#6D28D9'],
  constructive: ['#22C55E', '#15803D'],
};
