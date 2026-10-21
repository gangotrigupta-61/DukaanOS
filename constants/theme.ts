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
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  badge: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
};
