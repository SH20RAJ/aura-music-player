import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../constants/theme';
import { Track } from '../../types/track';
import { usePlayerStore } from '../../features/player/player-store';
import { useHaptics } from '../../hooks/useHaptics';
import { MiniWaveform } from '../atmosphere/MiniWaveform';

interface TrackRowProps {
  track: Track;
  index?: number;
  showArtwork?: boolean;
  onPress: () => void;
  onOptionsPress?: () => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  showArtwork = true,
  onPress,
  onOptionsPress,
}) => {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const toggleFavorite = usePlayerStore((state) => state.toggleFavorite);
  const haptics = useHaptics();

  const isCurrent = currentTrack?.id === track.id;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={[
        styles.container,
        isCurrent && styles.activeContainer,
      ]}
    >
      {/* Index or Now Playing Indicator */}
      {index !== undefined && !showArtwork && (
        <View style={styles.indexCol}>
          {isCurrent && isPlaying ? (
            <MiniWaveform color={track.dominantColor || Colors.primary} isPlaying={isPlaying} />
          ) : isCurrent ? (
            <Ionicons name="pause" size={16} color={track.dominantColor || Colors.primary} />
          ) : (
            <Text style={styles.indexText}>{index + 1}</Text>
          )}
        </View>
      )}

      {/* Artwork Thumbnail */}
      {showArtwork && (
        <View style={styles.artworkWrapper}>
          <Image
            source={{
              uri:
                track.artwork ||
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200',
            }}
            style={styles.artwork}
            contentFit="cover"
          />
          {isCurrent && (
            <View style={styles.artworkOverlay}>
              <MiniWaveform color="#FFFFFF" isPlaying={isPlaying} />
            </View>
          )}
        </View>
      )}

      {/* Info */}
      <View style={styles.infoCol}>
        <Text
          style={[
            styles.title,
            isCurrent && { color: track.dominantColor || '#00D2FF', fontWeight: '800' },
          ]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>

      {/* Favorite Heart Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          haptics.light();
          toggleFavorite(track.id);
        }}
        style={styles.actionBtn}
      >
        <Ionicons
          name={track.isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          color={track.isFavorite ? Colors.danger : Colors.textMuted}
        />
      </TouchableOpacity>

      {/* Options ⋮ Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          haptics.light();
          onOptionsPress?.();
        }}
        style={styles.actionBtn}
      >
        <Ionicons name="ellipsis-vertical" size={18} color={Colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    marginBottom: 4,
  },
  activeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  indexCol: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  indexText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  artworkWrapper: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: '#1E1E26',
    marginRight: 12,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  artworkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  artist: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  actionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
