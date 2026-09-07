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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { CreatePlaylistModal } from '../../components/playlists/CreatePlaylistModal';
import { useHaptics } from '../../hooks/useHaptics';

export default function PlaylistsScreen() {
  const router = useRouter();
  const playlists = useLibraryStore((state) => state.playlists);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const haptics = useHaptics();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>CURATED ATMOSPHERES</Text>
          <Text style={styles.title}>Playlists</Text>
        </View>

        {/* CREATE YOUR AURA Trigger */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            haptics.selection();
            setShowCreateModal(true);
          }}
          style={styles.createBtn}
        >
          <Ionicons name="add" size={20} color="#08080B" />
          <Text style={styles.createBtnText}>New Aura</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Playlists Grid */}
        <View style={styles.grid}>
          {playlists.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              activeOpacity={0.82}
              onPress={() => {
                haptics.selection();
                router.push(`/playlist/${encodeURIComponent(playlist.id)}` as any);
              }}
              style={styles.playlistCard}
            >
              <LinearGradient
                colors={playlist.gradientColors || ['#7952FC', '#00D2FF']}
                style={styles.coverGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="musical-notes" size={28} color="#FFFFFF" />
              </LinearGradient>

              <Text style={styles.playlistName} numberOfLines={1}>
                {playlist.name}
              </Text>
              <Text style={styles.playlistMeta}>
                {playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {playlists.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Playlists Yet</Text>
            <Text style={styles.emptySubtitle}>Tap 'New Aura' above to craft your first playlist</Text>
          </View>
        )}
      </ScrollView>

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(id) => router.push(`/playlist/${encodeURIComponent(id)}` as any)}
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
    marginBottom: 20,
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
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  createBtnText: {
    color: '#08080B',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  playlistCard: {
    width: '47%',
  },
  coverGradient: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  playlistName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  playlistMeta: {
    color: Colors.textMuted,
    fontSize: 12,
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
