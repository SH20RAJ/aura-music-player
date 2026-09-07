import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { usePlayerStore } from '../../features/player/player-store';
import { TrackRow } from '../../components/cards/TrackRow';
import { AlbumCard } from '../../components/cards/AlbumCard';
import { SongActionSheet } from '../../components/player/SongActionSheet';
import { Track } from '../../types/track';
import { useHaptics } from '../../hooks/useHaptics';

type TabSection = 'songs' | 'albums' | 'artists' | 'favorites';
type SortFilter = 'az' | 'most_played' | 'recently_played';

export default function LibraryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabSection>('songs');
  const [sortBy, setSortBy] = useState<SortFilter>('az');
  const [selectedTrackForActions, setSelectedTrackForActions] = useState<Track | null>(null);

  const tracks = useLibraryStore((state) => state.tracks);
  const albums = useLibraryStore((state) => state.albums);
  const artists = useLibraryStore((state) => state.artists);
  const favorites = useLibraryStore((state) => state.favorites);
  const scanDevice = useLibraryStore((state) => state.scanDevice);
  const importDemoMusic = useLibraryStore((state) => state.importDemoMusic);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const haptics = useHaptics();

  const handleScan = async () => {
    haptics.medium();
    try {
      const count = await scanDevice();
      Alert.alert('Scan Complete', `Found and imported ${count} songs from your device.`);
    } catch (err: any) {
      Alert.alert('Device Music', 'Permission was not granted or no local music files were found.');
    }
  };

  // Sort tracks
  const sortedTracks = [...tracks].sort((a, b) => {
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    if (sortBy === 'most_played') return (b.playCount || 0) - (a.playCount || 0);
    if (sortBy === 'recently_played') return (b.lastPlayedAt || 0) - (a.lastPlayedAt || 0);
    return 0;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
          <Text style={styles.title}>Your Library</Text>
        </View>

        {/* Import CTA Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleScan} style={styles.importBtn}>
          <Ionicons name="cloud-download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.importBtnText}>Import</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Filter Pills */}
      <View style={styles.segmentedRow}>
        {(['songs', 'albums', 'artists', 'favorites'] as TabSection[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.75}
            onPress={() => {
              haptics.selection();
              setActiveTab(tab);
            }}
            style={[styles.segmentPill, activeTab === tab && styles.activeSegmentPill]}
          >
            <Text style={[styles.segmentText, activeTab === tab && styles.activeSegmentText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Filter Row */}
      <View style={styles.sortRow}>
        <Text style={styles.countText}>
          {activeTab === 'songs' && `${tracks.length} songs`}
          {activeTab === 'albums' && `${albums.length} albums`}
          {activeTab === 'artists' && `${artists.length} artists`}
          {activeTab === 'favorites' && `${favorites.length} favorites`}
        </Text>

        <View style={styles.sortButtons}>
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              setSortBy(sortBy === 'az' ? 'most_played' : sortBy === 'most_played' ? 'recently_played' : 'az');
            }}
            style={styles.sortBtn}
          >
            <Ionicons name="swap-vertical" size={14} color={Colors.textMuted} style={{ marginRight: 4 }} />
            <Text style={styles.sortBtnText}>
              {sortBy === 'az' ? 'A → Z' : sortBy === 'most_played' ? 'Most Played' : 'Recently Played'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Songs Tab */}
        {activeTab === 'songs' && (
          <View>
            {sortedTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                onPress={() => setQueue(sortedTracks, idx, false)}
                onOptionsPress={() => setSelectedTrackForActions(track)}
              />
            ))}
          </View>
        )}

        {/* Albums Tab */}
        {activeTab === 'albums' && (
          <View style={styles.albumsGrid}>
            {albums.map((album) => (
              <View key={album.id} style={styles.albumGridItem}>
                <AlbumCard
                  album={album}
                  size={155}
                  onPress={() => router.push(`/album/${encodeURIComponent(album.title)}` as any)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Artists Tab */}
        {activeTab === 'artists' && (
          <View>
            {artists.map((artist) => (
              <TouchableOpacity
                key={artist.id}
                activeOpacity={0.7}
                onPress={() => router.push(`/artist/${encodeURIComponent(artist.name)}` as any)}
                style={styles.artistItem}
              >
                <View style={styles.artistAvatar}>
                  <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.artistMeta}>
                  <Text style={styles.artistName}>{artist.name}</Text>
                  <Text style={styles.artistSub}>
                    {artist.trackCount} {artist.trackCount === 1 ? 'song' : 'songs'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <View>
            {favorites.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                <Text style={styles.emptySubtitle}>Tap the heart icon on any song to save it here</Text>
              </View>
            ) : (
              favorites.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  onPress={() => setQueue(favorites, idx, false)}
                  onOptionsPress={() => setSelectedTrackForActions(track)}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Song Actions Bottom Sheet */}
      <SongActionSheet
        visible={!!selectedTrackForActions}
        track={selectedTrackForActions}
        onClose={() => setSelectedTrackForActions(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 16,
  },
  eyebrow: {
    color: '#00D2FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  importBtnText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  segmentedRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  segmentPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
  },
  activeSegmentPill: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  activeSegmentText: {
    color: '#08080B',
    fontWeight: '800',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  countText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortBtnText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 120,
  },
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 16,
  },
  albumGridItem: {
    width: '47%',
  },
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  artistAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  artistMeta: {
    flex: 1,
  },
  artistName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  artistSub: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
