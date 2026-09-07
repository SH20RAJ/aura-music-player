import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { usePlayerStore } from '../../features/player/player-store';
import { TrackRow } from '../../components/cards/TrackRow';
import { AlbumCard } from '../../components/cards/AlbumCard';
import { SongActionSheet } from '../../components/player/SongActionSheet';
import { Track, Artist } from '../../types/track';
import { useHaptics } from '../../hooks/useHaptics';

const RECENT_CHIPS = ['The Weeknd', 'Frank Ocean', 'Arijit Singh', 'Synthwave', 'Ambient'];
const VIBE_SEARCHES = ['Late Night Vibes', 'Deep Focus Flow', 'High Energy Workout', 'Sunset Chill'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const search = useLibraryStore((state) => state.search);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const [selectedTrackForActions, setSelectedTrackForActions] = useState<Track | null>(null);
  const haptics = useHaptics();

  const results = search(query);

  const handleTrackPress = async (track: Track) => {
    await setQueue([track, ...results.tracks.filter((t) => t.id !== track.id)], 0, false);
  };

  const handleArtistPress = (artist: Artist) => {
    router.push(`/artist/${encodeURIComponent(artist.name)}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>COMMAND CENTER</Text>
        <Text style={styles.title}>Search</Text>

        {/* Search Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search song, artist, album, vibe..."
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                haptics.light();
                setQuery('');
              }}
              style={styles.clearBtn}
            >
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Default View (No Query) */}
        {query.trim().length === 0 ? (
          <View>
            {/* Recent Searches */}
            <Text style={styles.subTitle}>RECENT</Text>
            <View style={styles.chipsRow}>
              {RECENT_CHIPS.map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.75}
                  onPress={() => {
                    haptics.selection();
                    setQuery(chip);
                  }}
                  style={styles.chip}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Explore Vibe Searches */}
            <Text style={[styles.subTitle, { marginTop: 28 }]}>EXPLORE VIBES</Text>
            <View style={styles.vibeGrid}>
              {VIBE_SEARCHES.map((vibe, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => {
                    haptics.selection();
                    setQuery(vibe.split(' ')[0]);
                  }}
                  style={styles.vibeCard}
                >
                  <Ionicons name="sparkles" size={18} color="#00D2FF" style={{ marginBottom: 8 }} />
                  <Text style={styles.vibeText}>{vibe}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* Search Results View */
          <View>
            {/* Songs Results */}
            {results.tracks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.resultsCategory}>SONGS</Text>
                {results.tracks.map((track) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    onPress={() => handleTrackPress(track)}
                    onOptionsPress={() => setSelectedTrackForActions(track)}
                  />
                ))}
              </View>
            )}

            {/* Artists Results */}
            {results.artists.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.resultsCategory}>ARTISTS</Text>
                {results.artists.map((artist) => (
                  <TouchableOpacity
                    key={artist.id}
                    activeOpacity={0.7}
                    onPress={() => handleArtistPress(artist)}
                    style={styles.artistRow}
                  >
                    <View style={styles.artistAvatar}>
                      <Ionicons name="person" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.artistInfo}>
                      <Text style={styles.artistName}>{artist.name}</Text>
                      <Text style={styles.artistTracks}>{artist.trackCount} tracks</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Albums Results */}
            {results.albums.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.resultsCategory}>ALBUMS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {results.albums.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      onPress={() => router.push(`/album/${encodeURIComponent(album.title)}` as any)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* No Results */}
            {results.tracks.length === 0 &&
              results.artists.length === 0 &&
              results.albums.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
                  <Text style={styles.emptyTitle}>No results found</Text>
                  <Text style={styles.emptySubtitle}>Try searching for another song, artist, or genre</Text>
                </View>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
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
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  subTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  vibeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vibeCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  vibeText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  resultsCategory: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  artistAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  artistTracks: {
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
    textAlign: 'center',
  },
});
