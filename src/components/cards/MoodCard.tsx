import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius } from '../../constants/theme';
import { MoodCapsule } from '../../types/mood';
import { useHaptics } from '../../hooks/useHaptics';

interface MoodCardProps {
  capsule: MoodCapsule;
  onPress: () => void;
  isActive?: boolean;
}

export const MoodCard: React.FC<MoodCardProps> = ({
  capsule,
  onPress,
  isActive = false,
}) => {
  const haptics = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        haptics.medium();
        onPress();
      }}
      style={[
        styles.container,
        isActive && { borderColor: capsule.dominantColor },
      ]}
    >
      <LinearGradient
        colors={[
          capsule.dominantColor + '30',
          capsule.secondaryColor + '15',
          '#121217',
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Glow Dot */}
      <View
        style={[
          styles.glowDot,
          { backgroundColor: capsule.dominantColor, shadowColor: capsule.dominantColor },
        ]}
      />

      {/* Center Emoji */}
      <View style={styles.emojiCircle}>
        <Text style={styles.emojiText}>{capsule.emoji}</Text>
      </View>

      {/* Info */}
      <View style={styles.infoCol}>
        <Text style={styles.title}>{capsule.label.toUpperCase()}</Text>
        <Text style={styles.tagline} numberOfLines={1}>
          {capsule.tagline}
        </Text>
      </View>

      {/* Tap prompt */}
      <View style={[styles.pill, { backgroundColor: capsule.dominantColor + '20' }]}>
        <Text style={[styles.pillText, { color: capsule.secondaryColor }]}>Flow ▶</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 220,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    padding: 16,
    marginRight: 14,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  glowDot: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.5,
    filter: 'blur(24px)',
  } as any,
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  emojiText: {
    fontSize: 28,
  },
  infoCol: {
    marginTop: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tagline: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
