import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { usePlayerStore } from '../../features/player/player-store';
import { useHaptics } from '../../hooks/useHaptics';

interface PlayerControlsProps {
  accentColor?: string;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({ accentColor = '#7952FC' }) => {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const repeatMode = usePlayerStore((state) => state.repeatMode);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const next = usePlayerStore((state) => state.next);
  const previous = usePlayerStore((state) => state.previous);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const toggleRepeat = usePlayerStore((state) => state.toggleRepeat);
  const haptics = useHaptics();

  return (
    <View style={styles.container}>
      {/* Shuffle Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          haptics.selection();
          toggleShuffle();
        }}
        style={styles.secondaryButton}
      >
        <Ionicons
          name="shuffle"
          size={22}
          color={shuffle ? accentColor : Colors.textMuted}
        />
        {shuffle && <View style={[styles.activeDot, { backgroundColor: accentColor }]} />}
      </TouchableOpacity>

      {/* Previous Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          haptics.light();
          previous();
        }}
        style={styles.actionButton}
      >
        <Ionicons name="play-skip-back" size={28} color={Colors.text} />
      </TouchableOpacity>

      {/* Main Play/Pause Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          haptics.medium();
          togglePlayPause();
        }}
        style={[
          styles.playPauseButton,
          {
            backgroundColor: '#FFFFFF',
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 18,
            elevation: 10,
          },
        ]}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={32}
          color="#08080B"
          style={!isPlaying ? { marginLeft: 4 } : undefined}
        />
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          haptics.light();
          next();
        }}
        style={styles.actionButton}
      >
        <Ionicons name="play-skip-forward" size={28} color={Colors.text} />
      </TouchableOpacity>

      {/* Repeat Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          haptics.selection();
          toggleRepeat();
        }}
        style={styles.secondaryButton}
      >
        <Ionicons
          name={repeatMode === 'one' ? 'repeat' : 'repeat'}
          size={22}
          color={repeatMode !== 'off' ? accentColor : Colors.textMuted}
        />
        {repeatMode === 'one' && (
          <View style={[styles.oneBadge, { backgroundColor: accentColor }]}>
            <Text style={styles.oneBadgeText}>1</Text>
          </View>
        )}
        {repeatMode === 'all' && (
          <View style={[styles.activeDot, { backgroundColor: accentColor }]} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  secondaryButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  oneBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oneBadgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900',
  },
});
