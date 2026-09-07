import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, BorderRadius } from '../../constants/theme';

interface GlassViewProps extends ViewProps {
  intensity?: number;
  tint?: 'dark' | 'light' | 'default';
  bordered?: boolean;
  glowColor?: string;
  borderRadius?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({
  children,
  style,
  intensity = 40,
  tint = 'dark',
  bordered = true,
  glowColor,
  borderRadius = BorderRadius.lg,
  ...props
}) => {
  const containerStyle = [
    styles.container,
    { borderRadius },
    bordered && styles.bordered,
    glowColor && {
      borderColor: glowColor,
      shadowColor: glowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    style,
  ];

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          containerStyle,
          {
            backgroundColor: Colors.glass,
            backdropFilter: `blur(${intensity / 4}px)`,
          } as any,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} tint={tint} style={containerStyle} {...props}>
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
});
