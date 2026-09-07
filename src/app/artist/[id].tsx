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
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { usePlayerStore } from '../../features/player/player-store';
import { TrackRow } from '../../components/cards/TrackRow';
import { useHaptics } from '../../hooks/useHaptics';

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artistName = decodeURIComponent(id || '');
  const router = useRouter();
  const tracks = useLibraryStore((state) => state.tracks);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const haptics = useHaptics();

  const artistTracks = tracks.filter((t) => t.artist.toLowerCase() === artistName.toLowerCase());

  const handlePlay = async () => {
    haptics.medium();
    if (artistTracks.length > 0) {
      await setQueue(artistTracks, 0, false);
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
        {/* Artist Header */}
        <View style={styles.artistHeader}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={54} color="#FFFFFF" />
          </View>
          <Text style={styles.artistName}>{artistName}</Text>
          <Text style={styles.statsText}>
            {artistTracks.length} {artistTracks.length === 1 ? 'song' : 'songs'} in your library
          </Text>

          <TouchableOpacity activeOpacity={0.85} onPress={handlePlay} style={styles.playBtn}>
            <Ionicons name="play" size={18} color="#08080B" style={{ marginRight: 6 }} />
            <Text style={styles.playBtnText}>Play Artist Radio</Text>
          </TouchableOpacity>
        </View>

        {/* Songs List */}
        <Text style={styles.sectionTitle}>POPULAR TRACKS</Text>
        <View style={styles.tracksList}>
          {artistTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              onPress={() => setQueue(artistTracks, idx, false)}
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
  artistHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  artistName: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  statsText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 20,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
  },
  playBtnText: {
    color: '#08080B',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  tracksList: {
    marginTop: 4,
  },
});
