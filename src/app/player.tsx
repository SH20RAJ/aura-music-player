import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { usePlayerStore } from '../features/player/player-store';
import { useAtmosphereColor } from '../hooks/useAtmosphereColor';
import { useHaptics } from '../hooks/useHaptics';
import { AmbientGlow } from '../components/atmosphere/AmbientGlow';
import { ArtworkBreathing } from '../components/atmosphere/ArtworkBreathing';
import { AudioVisualizer } from '../components/atmosphere/AudioVisualizer';
import { LyricsView } from '../components/player/LyricsView';
import { ProgressBar } from '../components/player/ProgressBar';
import { PlayerControls } from '../components/player/PlayerControls';
import { QueueBottomSheet } from '../components/player/QueueBottomSheet';
import { SongActionSheet } from '../components/player/SongActionSheet';

const { width, height } = Dimensions.get('window');

export default function FullPlayerScreen() {
  const router = useRouter();
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const activePlayerView = usePlayerStore((state) => state.activePlayerView);
  const cyclePlayerView = usePlayerStore((state) => state.cyclePlayerView);
  const toggleFavorite = usePlayerStore((state) => state.toggleFavorite);
  const next = usePlayerStore((state) => state.next);
  const previous = usePlayerStore((state) => state.previous);
  const { dominant, secondary } = useAtmosphereColor();
  const haptics = useHaptics();

  const [showQueueSheet, setShowQueueSheet] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // Gesture handling for Swipes (Down to close, Left to next, Right to prev)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return (
          Math.abs(gesture.dy) > 20 ||
          Math.abs(gesture.dx) > 30
        );
      },
      onPanResponderRelease: (_, gesture) => {
        // Swipe Down -> Close player
        if (gesture.dy > 70 && Math.abs(gesture.dx) < 60) {
          haptics.light();
          router.back();
          return;
        }

        // Swipe Left -> Next song
        if (gesture.dx < -60 && Math.abs(gesture.dy) < 60) {
          haptics.light();
          next();
          return;
        }

        // Swipe Right -> Previous song
        if (gesture.dx > 60 && Math.abs(gesture.dy) < 60) {
          haptics.light();
          previous();
          return;
        }
      },
    })
  ).current;

  if (!currentTrack) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No track playing</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Background Dynamic Atmosphere */}
      <AmbientGlow intensity="full" />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              haptics.light();
              router.back();
            }}
            style={styles.collapseBtn}
          >
            <Ionicons name="chevron-down" size={26} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerEyebrow}>PLAYING FROM LIBRARY</Text>
            <Text style={styles.headerAlbum} numberOfLines={1}>
              {currentTrack.album}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              haptics.selection();
              setShowActionSheet(true);
            }}
            style={styles.collapseBtn}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Artwork Area (Tap to cycle: Artwork -> Lyrics -> Visualizer, Long press for actions) */}
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => {
            haptics.selection();
            cyclePlayerView();
          }}
          onLongPress={() => {
            haptics.heavy();
            setShowActionSheet(true);
          }}
          style={styles.artworkTouchable}
        >
          {activePlayerView === 'artwork' && (
            <ArtworkBreathing uri={currentTrack.artwork} glowColor={dominant} />
          )}

          {activePlayerView === 'lyrics' && (
            <LyricsView lyrics={currentTrack.lyrics} accentColor={dominant} />
          )}

          {activePlayerView === 'visualizer' && (
            <AudioVisualizer color={dominant} secondaryColor={secondary} />
          )}

          {/* View Mode Indicator Pill */}
          <View style={styles.viewModePill}>
            <Text style={styles.viewModeText}>
              {activePlayerView === 'artwork' && 'Artwork • Tap for Lyrics'}
              {activePlayerView === 'lyrics' && 'Lyrics • Tap for Visualizer'}
              {activePlayerView === 'visualizer' && 'Visualizer • Tap for Artwork'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Track Metadata & Heart Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              haptics.light();
              toggleFavorite(currentTrack.id);
            }}
            style={styles.heartBtn}
          >
            <Ionicons
              name={currentTrack.isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color={currentTrack.isFavorite ? Colors.danger : Colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Continuous Scrubber Progress Bar */}
        <ProgressBar accentColor={dominant} />

        {/* Main Controls */}
        <PlayerControls accentColor={dominant} />

        {/* Bottom Up Next Queue Trigger */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            haptics.selection();
            setShowQueueSheet(true);
          }}
          style={styles.upNextTrigger}
        >
          <Ionicons name="chevron-up" size={16} color={Colors.textMuted} />
          <Text style={styles.upNextText}>UP NEXT</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Up Next Queue Bottom Sheet */}
      <QueueBottomSheet
        visible={showQueueSheet}
        onClose={() => setShowQueueSheet(false)}
        accentColor={dominant}
      />

      {/* Song Actions Bottom Sheet */}
      <SongActionSheet
        visible={showActionSheet}
        track={currentTrack}
        onClose={() => setShowActionSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 8,
  },
  collapseBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    alignItems: 'center',
    flex: 1,
  },
  headerEyebrow: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerAlbum: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  artworkTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  viewModePill: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: -8,
  },
  viewModeText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metaCol: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  trackArtist: {
    color: Colors.textMuted,
    fontSize: 17,
    fontWeight: '500',
  },
  heartBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upNextTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  upNextText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backBtnText: {
    color: Colors.text,
    fontWeight: '600',
  },
});
