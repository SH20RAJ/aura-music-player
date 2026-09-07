export const Colors = {
  background: '#08080B',
  surface: '#121217',
  surfaceElevated: '#1A1A22',
  surfaceHighlight: '#22222D',
  glass: 'rgba(18, 18, 23, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassGlow: 'rgba(255, 255, 255, 0.04)',
  
  text: '#F7F7FA',
  textSecondary: '#C5C5D2',
  textMuted: '#8B8B98',
  textSubtle: '#5A5A68',
  
  primary: '#7952FC', // Default dynamic purple
  primaryGlow: 'rgba(121, 82, 252, 0.35)',
  secondary: '#00D2FF',
  
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  
  tabBar: 'rgba(10, 10, 14, 0.88)',
  miniPlayer: 'rgba(18, 18, 23, 0.92)',
  miniPlayerBorder: 'rgba(255, 255, 255, 0.09)',
};

export const PalettePresets = {
  blue: {
    dominant: '#0066FF',
    glow: 'rgba(0, 102, 255, 0.45)',
    accent: '#00E5FF',
    gradient: ['#0A192F', '#0044AA'] as [string, string],
  },
  red: {
    dominant: '#E50914',
    glow: 'rgba(229, 9, 20, 0.45)',
    accent: '#FF6B6B',
    gradient: ['#2A0808', '#8B0000'] as [string, string],
  },
  purple: {
    dominant: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.45)',
    accent: '#D946EF',
    gradient: ['#1E1035', '#6D28D9'] as [string, string],
  },
  emerald: {
    dominant: '#10B981',
    glow: 'rgba(16, 185, 129, 0.45)',
    accent: '#34D399',
    gradient: ['#062419', '#047857'] as [string, string],
  },
  amber: {
    dominant: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.45)',
    accent: '#FBBF24',
    gradient: ['#261603', '#B45309'] as [string, string],
  },
  midnight: {
    dominant: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.4)',
    accent: '#60A5FA',
    gradient: ['#0B132B', '#1C2541'] as [string, string],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};
