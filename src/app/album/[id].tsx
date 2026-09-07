import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { usePlayerStore } from '../../features/player/player-store';
import { TrackRow } from '../../components/cards/TrackRow';
import { useHaptics } from '../../hooks/useHaptics';

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const albumTitle = decodeURIComponent(id || '');
  const router = useRouter();
  const tracks = useLibraryStore((state) => state.tracks);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const haptics = useHaptics();

  const albumTracks = tracks.filter((t) => t.album === albumTitle);
  const firstTrack = albumTracks[0];

  const handlePlayAll = async (shuffle = false) => {
    haptics.medium();
    if (albumTracks.length > 0) {
      await setQueue(albumTracks, 0, false);
      if (shuffle) {
        toggleShuffle();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            haptics.light();
            router.back();
          }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Album Artwork & Meta */}
        <View style={styles.albumHeader}>
          <Image
            source={{
              uri:
                firstTrack?.artwork ||
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
            }}
            style={styles.artwork}
            contentFit="cover"
          />
          <Text style={styles.albumTitle}>{albumTitle}</Text>
          <Text style={styles.albumArtist}>{firstTrack?.artist || 'Unknown Artist'}</Text>
          <Text style={styles.albumStats}>
            {albumTracks.length} {albumTracks.length === 1 ? 'song' : 'songs'} • {firstTrack?.year || 2024}
          </Text>
        </View>

        {/* Play & Shuffle Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handlePlayAll(false)}
            style={styles.playBtn}
          >
            <Ionicons name="play" size={20} color="#08080B" style={{ marginRight: 6 }} />
            <Text style={styles.playBtnText}>Play All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handlePlayAll(true)}
            style={styles.shuffleBtn}
          >
            <Ionicons name="shuffle" size={20} color={Colors.text} style={{ marginRight: 6 }} />
            <Text style={styles.shuffleBtnText}>Shuffle</Text>
          </TouchableOpacity>
        </View>

        {/* Tracks List */}
        <View style={styles.tracksList}>
          {albumTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              showArtwork={false}
              onPress={() => setQueue(albumTracks, idx, false)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  albumHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  artwork: {
    width: 220,
    height: 220,
    borderRadius: BorderRadius.xl,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  albumTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  albumArtist: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  albumStats: {
    color: Colors.textSubtle,
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  playBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: '#08080B',
    fontSize: 15,
    fontWeight: '800',
  },
  shuffleBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  shuffleBtnText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  tracksList: {
    marginTop: 8,
  },
});
