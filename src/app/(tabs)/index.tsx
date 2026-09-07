import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius } from '../../constants/theme';
import { MOOD_CAPSULES } from '../../constants/moods';
import { useLibraryStore } from '../../features/library/library-store';
import { usePlayerStore } from '../../features/player/player-store';
import { AuraEngine } from '../../features/recommendations/aura-engine';
import { MoodCard } from '../../components/cards/MoodCard';
import { AlbumCard } from '../../components/cards/AlbumCard';
import { TrackRow } from '../../components/cards/TrackRow';
import { AmbientGlow } from '../../components/atmosphere/AmbientGlow';
import { SongActionSheet } from '../../components/player/SongActionSheet';
import { Track, Album } from '../../types/track';
import { MoodVibeKey } from '../../types/mood';
import { useHaptics } from '../../hooks/useHaptics';
import { VibeRadarModal } from '../../components/player/VibeRadarModal';

export default function HomeScreen() {
  const router = useRouter();
  const tracks = useLibraryStore((state) => state.tracks);
  const albums = useLibraryStore((state) => state.albums);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const haptics = useHaptics();

  const [activeMood, setActiveMood] = useState<MoodVibeKey | null>(null);
  const [selectedTrackForActions, setSelectedTrackForActions] = useState<Track | null>(null);
  const [showVibeRadar, setShowVibeRadar] = useState(false);

  // Dynamic greeting based on user's current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Sh.';
    if (hour < 18) return 'Good afternoon, Sh.';
    return 'Good evening, Sh.';
  };

  const handleMoodSelect = async (moodId: MoodVibeKey) => {
    setActiveMood(moodId);
    haptics.medium();
    const moodQueue = AuraEngine.buildMoodQueue(moodId, tracks);
    if (moodQueue.length > 0) {
      await setQueue(moodQueue, 0, true);
    }
  };

  const handleAlbumPress = (album: Album) => {
    router.push(`/album/${encodeURIComponent(album.title)}` as any);
  };

  const handleTrackPress = async (track: Track, index: number) => {
    await setQueue(tracks, index, false);
  };

  return (
    <View style={styles.container}>
      <AmbientGlow intensity="subtle" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.subGreeting}>What are you feeling?</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/profile' as any)}
              style={styles.profileAvatar}
            >
              <Text style={styles.profileInitials}>SH</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Search Trigger */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/search' as any)}
            style={styles.searchBar}
          >
            <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
            <Text style={styles.searchText}>Search songs, artists, vibes...</Text>
          </TouchableOpacity>

          {/* YOUR AURA Mood Capsules */}
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionEyebrow}>AURA FLOW</Text>
              <Text style={styles.sectionTitle}>Your Aura</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                haptics.selection();
                setShowVibeRadar(true);
              }}
              style={styles.vibeRadarBtn}
            >
              <Ionicons name="compass-outline" size={16} color="#00D2FF" style={{ marginRight: 5 }} />
              <Text style={styles.vibeRadarBtnText}>Vibe Radar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {MOOD_CAPSULES.map((capsule) => (
              <MoodCard
                key={capsule.id}
                capsule={capsule}
                isActive={activeMood === capsule.id}
                onPress={() => handleMoodSelect(capsule.id)}
              />
            ))}
          </ScrollView>

          {/* RECENTLY PLAYED Albums */}
          {albums.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEyebrow}>JUMP BACK IN</Text>
                <Text style={styles.sectionTitle}>Recently Played</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {albums.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onPress={() => handleAlbumPress(album)}
                    onLongPress={() => {
                      const firstTrack = tracks.find((t) => t.album === album.title);
                      if (firstTrack) setSelectedTrackForActions(firstTrack);
                    }}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* MADE FOR YOU Tracks */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>HANDPICKED</Text>
              <Text style={styles.sectionTitle}>Made For You</Text>
            </View>

            <View style={styles.tracksList}>
              {tracks.slice(0, 6).map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  onPress={() => handleTrackPress(track, idx)}
                  onOptionsPress={() => setSelectedTrackForActions(track)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Song Actions Bottom Sheet */}
      <SongActionSheet
        visible={!!selectedTrackForActions}
        track={selectedTrackForActions}
        onClose={() => setSelectedTrackForActions(null)}
      />

      {/* Vibe Radar 2D Modal */}
      <VibeRadarModal
        visible={showVibeRadar}
        onClose={() => setShowVibeRadar(false)}
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
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greeting: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subGreeting: {
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 2,
  },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  sectionContainer: {
    marginTop: 28,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  vibeRadarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 210, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.3)',
  },
  vibeRadarBtnText: {
    color: '#00D2FF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionEyebrow: {
    color: '#00D2FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  tracksList: {
    paddingHorizontal: 12,
  },
});
