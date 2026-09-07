import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { usePlayerStore } from '../../features/player/player-store';
import { TrackRow } from '../../components/cards/TrackRow';
import { Track } from '../../types/track';
import { useHaptics } from '../../hooks/useHaptics';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const playlists = useLibraryStore((state) => state.playlists);
  const getPlaylistTracks = useLibraryStore((state) => state.getPlaylistTracks);
  const deletePlaylist = useLibraryStore((state) => state.deletePlaylist);
  const libraryTracks = useLibraryStore((state) => state.tracks);
  const addTrackToPlaylist = useLibraryStore((state) => state.addTrackToPlaylist);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const haptics = useHaptics();

  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const playlist = playlists.find((p) => p.id === id);

  useEffect(() => {
    if (id) {
      getPlaylistTracks(id).then((t) => {
        // If empty, auto-populate with a couple demo tracks so playlist is ready to play
        if (t.length === 0 && libraryTracks.length > 0) {
          const sample = libraryTracks.slice(0, 3);
          sample.forEach((tr) => addTrackToPlaylist(id, tr.id));
          setPlaylistTracks(sample);
        } else {
          setPlaylistTracks(t);
        }
      });
    }
  }, [id, libraryTracks.length]);

  const handlePlayAll = async (shuffle = false) => {
    haptics.medium();
    if (playlistTracks.length > 0) {
      await setQueue(playlistTracks, 0, false);
      if (shuffle) toggleShuffle();
    }
  };

  const handleDelete = () => {
    haptics.heavy();
    Alert.alert('Delete Playlist', 'Are you sure you want to delete this AURA playlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (id) {
            await deletePlaylist(id);
            router.back();
          }
        },
      },
    ]);
  };

  if (!playlist) return null;

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

        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Playlist Cover Header */}
        <View style={styles.coverHeader}>
          <LinearGradient
            colors={playlist.gradientColors || ['#7952FC', '#00D2FF']}
            style={styles.coverGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="musical-notes" size={48} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.playlistName}>{playlist.name}</Text>
          <Text style={styles.meta}>
            AURA MIX • {playlistTracks.length} {playlistTracks.length === 1 ? 'track' : 'tracks'}
          </Text>
        </View>

        {/* Play & Shuffle Buttons */}
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
          {playlistTracks.map((track, idx) => (
            <TrackRow
              key={`${track.id}_${idx}`}
              track={track}
              index={idx}
              onPress={() => setQueue(playlistTracks, idx, false)}
            />
          ))}

          {playlistTracks.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Playlist is empty</Text>
              <Text style={styles.emptySub}>Long-press any track to add it to this playlist</Text>
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  coverHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  coverGradient: {
    width: 180,
    height: 180,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  playlistName: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  meta: {
    color: Colors.textMuted,
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
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
