import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors, BorderRadius } from '../../constants/theme';
import { Album } from '../../types/track';
import { useHaptics } from '../../hooks/useHaptics';

interface AlbumCardProps {
  album: Album;
  onPress: () => void;
  onLongPress?: () => void;
  size?: number;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onPress,
  onLongPress,
  size = 145,
}) => {
  const haptics = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      onLongPress={() => {
        haptics.heavy();
        onLongPress?.();
      }}
      style={[styles.container, { width: size }]}
    >
      <View style={[styles.artworkWrapper, { width: size, height: size }]}>
        <Image
          source={{
            uri:
              album.artwork ||
              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
          }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        {/* Subtle gloss overlay */}
        <View style={styles.gloss} />
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {album.title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {album.artist}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 14,
  },
  artworkWrapper: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#1E1E26',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gloss: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  title: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  artist: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
});
