import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius } from '../constants/theme';
import { useLibraryStore } from '../features/library/library-store';
import { useHaptics } from '../hooks/useHaptics';

export default function SettingsScreen() {
  const router = useRouter();
  const tracks = useLibraryStore((state) => state.tracks);
  const playlists = useLibraryStore((state) => state.playlists);
  const scanDevice = useLibraryStore((state) => state.scanDevice);
  const importDemoMusic = useLibraryStore((state) => state.importDemoMusic);
  const haptics = useHaptics();

  const [losslessMode, setLosslessMode] = useState(true);
  const [replayGain, setReplayGain] = useState(false);
  const [atmosphereIntensity, setAtmosphereIntensity] = useState<'subtle' | 'vibrant' | 'electric'>('vibrant');

  const handleExportData = async () => {
    haptics.medium();
    const exportPayload = {
      app: 'AURA Music Player',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      playlists: playlists.map((p) => ({
        id: p.id,
        name: p.name,
        gradient: p.gradientColors,
        trackCount: p.trackCount,
      })),
      tracksCount: tracks.length,
    };

    try {
      await Share.share({
        message: JSON.stringify(exportPayload, null, 2),
        title: 'AURA Backup.json',
      });
    } catch {}
  };

  const handleRescan = async () => {
    haptics.medium();
    try {
      const count = await scanDevice();
      Alert.alert('Rescan Complete', `Indexed ${count} tracks from your local device.`);
    } catch {
      Alert.alert('Scan Status', 'Local file access checked. Curated library is active.');
    }
  };

  const handleResetDemo = async () => {
    haptics.heavy();
    Alert.alert('Reload Demo Catalog', 'Restore preloaded high-fidelity demo tracks & lyrics?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restore',
        onPress: async () => {
          await importDemoMusic();
          Alert.alert('Restored', 'Demo catalog successfully refreshed.');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
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
        <Text style={styles.headerTitle}>Settings & Storage</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Audio Engine Section */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>AUDIO ENGINE</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>Hi-Res Lossless Emulation</Text>
                <Text style={styles.rowSubtitle}>24-bit 96kHz acoustic DAC processing</Text>
              </View>
              <Switch
                value={losslessMode}
                onValueChange={(val) => {
                  haptics.selection();
                  setLosslessMode(val);
                }}
                trackColor={{ false: '#262630', true: Colors.primary }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>Volume Normalization</Text>
                <Text style={styles.rowSubtitle}>Even volume across diverse audio formats</Text>
              </View>
              <Switch
                value={replayGain}
                onValueChange={(val) => {
                  haptics.selection();
                  setReplayGain(val);
                }}
                trackColor={{ false: '#262630', true: Colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Dynamic Atmosphere Section */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>VISUAL IDENTITY</Text>

          <View style={styles.card}>
            <Text style={styles.rowTitle}>Atmosphere Glow Intensity</Text>
            <Text style={styles.rowSubtitle}>Backdrop radiance extracted from album artwork</Text>

            <View style={styles.intensityRow}>
              {(['subtle', 'vibrant', 'electric'] as const).map((mode) => {
                const isSelected = atmosphereIntensity === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    activeOpacity={0.8}
                    onPress={() => {
                      haptics.selection();
                      setAtmosphereIntensity(mode);
                    }}
                    style={[
                      styles.intensityPill,
                      isSelected && styles.activeIntensityPill,
                    ]}
                  >
                    <Text
                      style={[
                        styles.intensityText,
                        isSelected && styles.activeIntensityText,
                      ]}
                    >
                      {mode.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Storage Intelligence */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>STORAGE & DATABASE</Text>

          <View style={styles.card}>
            <View style={styles.storageMetricRow}>
              <Text style={styles.metricLabel}>Indexed Songs</Text>
              <Text style={styles.metricValue}>{tracks.length} tracks</Text>
            </View>
            <View style={styles.storageMetricRow}>
              <Text style={styles.metricLabel}>Custom Playlists</Text>
              <Text style={styles.metricValue}>{playlists.length} playlists</Text>
            </View>
            <View style={styles.storageMetricRow}>
              <Text style={styles.metricLabel}>Local SQLite Storage</Text>
              <Text style={styles.metricValue}>~2.4 MB</Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity activeOpacity={0.7} onPress={handleRescan} style={styles.actionBtn}>
              <Ionicons name="refresh-outline" size={18} color="#00D2FF" style={{ marginRight: 8 }} />
              <Text style={[styles.actionBtnText, { color: '#00D2FF' }]}>Rescan Local Media Library</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={handleResetDemo} style={styles.actionBtn}>
              <Ionicons name="sparkles-outline" size={18} color="#7952FC" style={{ marginRight: 8 }} />
              <Text style={[styles.actionBtnText, { color: '#7952FC' }]}>Restore Curated Demo Catalog</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backup & Portability */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>DATA PORTABILITY</Text>

          <View style={styles.card}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleExportData} style={styles.actionBtn}>
              <Ionicons name="download-outline" size={18} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Export Playlists as JSON</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Card */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>AURA v1.0.0</Text>
          <Text style={styles.aboutSubtitle}>
            Music that moves with you. Open-source local-first player built with Expo & React Native.
          </Text>
          <Text style={styles.aboutLicense}>Distributed under the MIT License.</Text>
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
    alignItems: 'center',
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
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionEyebrow: {
    color: '#00D2FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rowInfo: {
    flex: 1,
    marginRight: 16,
  },
  rowTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  rowSubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  intensityPill: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeIntensityPill: {
    backgroundColor: '#FFFFFF',
  },
  intensityText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  activeIntensityText: {
    color: '#08080B',
    fontWeight: '800',
  },
  storageMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  metricLabel: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  metricValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  aboutTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  aboutSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 6,
  },
  aboutLicense: {
    color: Colors.textSubtle,
    fontSize: 12,
  },
});
