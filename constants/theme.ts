export const Colors = {
  // Primary palette - Forest Green
  primary: '#1B5E20',
  primaryDark: '#0D3813',
  primaryLight: '#2E7D32',
  primarySurface: '#E8F5E9',

  // Background and Surfaces - Warm light theme
  background: '#FBF9F5',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F2EC',

  // Text colors - High contrast for readability
  textPrimary: '#141E15',
  textSecondary: '#4A5548',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',

  // Borders & Accents
  border: '#E3DFD5',
  borderStrong: '#C5C1B6',
  accentGreen: '#388E3C',
  accentLight: '#C8E6C9',

  // Status indicators
  success: '#2E7D32',
  warning: '#E65100',
  error: '#C62828',
  info: '#1565C0',
  purple: '#673AB7',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const Touch = {
  minTarget: 48, // 48dp minimum touch target for comfortable one-handed mobile use
  buttonHeight: 52,
  inputHeight: 52,
  chipHeight: 44,
};

export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700' as const,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
};
