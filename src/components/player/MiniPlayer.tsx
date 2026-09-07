import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius } from '../../constants/theme';
import { usePlayerStore } from '../../features/player/player-store';
import { useAtmosphereColor } from '../../hooks/useAtmosphereColor';
import { useHaptics } from '../../hooks/useHaptics';

const { width } = Dimensions.get('window');

export const MiniPlayer: React.FC = () => {
  const router = useRouter();
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const position = usePlayerStore((state) => state.position);
  const duration = usePlayerStore((state) => state.duration);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const next = usePlayerStore((state) => state.next);
  const { dominant, glow } = useAtmosphereColor();
  const haptics = useHaptics();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;

  const handleOpenFullPlayer = () => {
    haptics.selection();
    router.push('/player' as any);
  };

  return (
    <View style={styles.outerWrapper} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handleOpenFullPlayer}
        style={[
          styles.container,
          {
            shadowColor: glow,
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
        ]}
      >
        {/* Subtle top progress bar */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent * 100}%`,
                backgroundColor: dominant,
              },
            ]}
          />
        </View>

        <View style={styles.contentRow}>
          {/* Artwork */}
          <Image
            source={{
              uri:
                currentTrack.artwork ||
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300',
            }}
            style={styles.artwork}
            contentFit="cover"
          />

          {/* Track metadata */}
          <View style={styles.metaCol}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                haptics.light();
                togglePlayPause();
              }}
              style={styles.controlBtn}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={24}
                color={Colors.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                haptics.light();
                next();
              }}
              style={styles.controlBtn}
            >
              <Ionicons name="play-skip-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 84 : 70,
    left: 12,
    right: 12,
    zIndex: 999,
  },
  container: {
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.miniPlayer,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  progressBarBackground: {
    height: 2.5,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarFill: {
    height: '100%',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  artwork: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    backgroundColor: '#1E1E26',
  },
  metaCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
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
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
