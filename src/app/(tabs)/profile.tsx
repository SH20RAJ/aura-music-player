import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { AnalyticsEngine } from '../../features/recommendations/analytics-engine';
import { useHaptics } from '../../hooks/useHaptics';

export default function ProfileScreen() {
  const tracks = useLibraryStore((state) => state.tracks);
  const albums = useLibraryStore((state) => state.albums);
  const artists = useLibraryStore((state) => state.artists);
  const recentlyPlayed = useLibraryStore((state) => state.recentlyPlayed);
  const haptics = useHaptics();

  const personality = AnalyticsEngine.calculateListeningPersonality(tracks, recentlyPlayed);
  const topArtist = AnalyticsEngine.getTopArtist(tracks);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Identity Banner */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SH</Text>
          </View>
          <Text style={styles.userName}>Shaswat</Text>
          <Text style={styles.userTagline}>AURA Member • Local Archive Active</Text>
        </View>

        {/* Listening Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>ARCHIVE STATS</Text>
          <Text style={styles.sectionTitle}>Your Listening</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{tracks.length}</Text>
              <Text style={styles.statLabel}>songs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{artists.length}</Text>
              <Text style={styles.statLabel}>artists</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{albums.length}</Text>
              <Text style={styles.statLabel}>albums</Text>
            </View>
          </View>
        </View>

        {/* TOP ARTIST */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>MOST REVERED</Text>
          <Text style={styles.sectionTitle}>Top Artist</Text>

          <View style={styles.topArtistCard}>
            <View style={styles.artistIconCircle}>
              <Ionicons name="musical-notes" size={24} color="#00D2FF" />
            </View>
            <View style={styles.artistInfo}>
              <Text style={styles.topArtistName}>{topArtist.name}</Text>
              <Text style={styles.topArtistPlays}>Top rotation in your soundscape</Text>
            </View>
            <Ionicons name="sparkles" size={20} color="#7952FC" />
          </View>
        </View>

        {/* LISTENING PERSONALITY */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>IDENTITY</Text>
          <Text style={styles.sectionTitle}>Listening Personality</Text>

          <View style={styles.personalityCard}>
            <View style={styles.personalityHeader}>
              <Text style={styles.personalityBadge}>✦ {personality.title.toUpperCase()}</Text>
              <Ionicons name="moon" size={18} color="#7952FC" />
            </View>
            <Text style={styles.personalitySub}>{personality.subtitle}</Text>
            <View style={styles.personalityDivider} />
            <View style={styles.peakRow}>
              <Text style={styles.peakLabel}>Peak Listening:</Text>
              <Text style={styles.peakTime}>{personality.peakListeningTime}</Text>
            </View>
          </View>
        </View>

        {/* YOUR 2026 RECAP */}
        <View style={styles.section}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => haptics.medium()}
            style={styles.recapCard}
          >
            <LinearGradient
              colors={['#7928CA', '#FF0080', '#08080B']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.recapInner}>
              <Text style={styles.recapEyebrow}>COMING SOON</Text>
              <Text style={styles.recapTitle}>Your 2026</Text>
              <Text style={styles.recapDesc}>
                Your yearly sonic recap — every late night vibe, every pulse, uniquely visualised.
              </Text>
            </View>
          </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  userName: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  userTagline: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  section: {
    marginBottom: 26,
  },
  sectionEyebrow: {
    color: '#00D2FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topArtistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  artistIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  artistInfo: {
    flex: 1,
  },
  topArtistName: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  topArtistPlays: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  personalityCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  personalityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  personalityBadge: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  personalitySub: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 12,
  },
  personalityDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  peakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  peakLabel: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  peakTime: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  recapCard: {
    height: 140,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'flex-end',
  },
  recapInner: {
    padding: 18,
  },
  recapEyebrow: {
    color: '#00DFD8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  recapTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  recapDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    lineHeight: 16,
  },
});
