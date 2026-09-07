import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtmosphereColor } from '../../hooks/useAtmosphereColor';

const { width, height } = Dimensions.get('window');

interface AmbientGlowProps {
  intensity?: 'subtle' | 'vibrant' | 'full';
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({ intensity = 'vibrant' }) => {
  const { dominant, glow, gradient } = useAtmosphereColor();

  const opacity = intensity === 'subtle' ? 0.35 : intensity === 'full' ? 0.85 : 0.6;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Deep atmosphere base gradient */}
      <LinearGradient
        colors={[gradient[0], '#08080B', '#08080B']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Dynamic top ambient glow orb */}
      <View
        style={[
          styles.glowOrb,
          {
            backgroundColor: glow,
            opacity,
            top: -height * 0.15,
            left: width * 0.1,
          },
        ]}
      />

      {/* Secondary accent glow orb */}
      <View
        style={[
          styles.secondaryOrb,
          {
            backgroundColor: dominant,
            opacity: opacity * 0.45,
            top: height * 0.25,
            right: -width * 0.15,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  glowOrb: {
    position: 'absolute',
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: (width * 1.1) / 2,
    filter: 'blur(90px)',
    transform: [{ scale: 1.1 }],
  } as any,
  secondaryOrb: {
    position: 'absolute',
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    filter: 'blur(100px)',
  } as any,
});
