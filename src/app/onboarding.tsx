import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius } from '../constants/theme';
import { useLibraryStore } from '../features/library/library-store';
import { useHaptics } from '../hooks/useHaptics';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'welcome' | 'source'>('welcome');
  const scanDevice = useLibraryStore((state) => state.scanDevice);
  const importDemoMusic = useLibraryStore((state) => state.importDemoMusic);
  const haptics = useHaptics();

  const handleStart = () => {
    haptics.medium();
    setStep('source');
  };

  const handleImportDevice = async () => {
    haptics.medium();
    try {
      const count = await scanDevice();
      Alert.alert('Scan Complete', `Found ${count} songs from your device. Welcome to AURA!`, [
        { text: 'Start Listening', onPress: () => router.replace('/(tabs)' as any) },
      ]);
    } catch {
      Alert.alert('Permission Needed', 'Device access was denied. Continuing with curated demo music.', [
        {
          text: 'Continue',
          onPress: async () => {
            await importDemoMusic();
            router.replace('/(tabs)' as any);
          },
        },
      ]);
    }
  };

  const handleDemoMusic = async () => {
    haptics.medium();
    await importDemoMusic();
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#16082F', '#08080B', '#08080B']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {step === 'welcome' ? (
          <View style={styles.content}>
            <View style={styles.centerHero}>
              <View style={styles.auraOrb}>
                <Ionicons name="sparkles" size={48} color="#00D2FF" />
              </View>

              <Text style={styles.brandTitle}>AURA</Text>
              <Text style={styles.eyebrow}>MUSIC THAT MOVES WITH YOU ✦</Text>
              <Text style={styles.tagline}>
                Beautiful. Personal. Completely yours.
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleStart} style={styles.startBtn}>
              <Text style={styles.startBtnText}>START</Text>
              <Ionicons name="arrow-forward" size={18} color="#08080B" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.sourceHero}>
              <Text style={styles.sourceEyebrow}>WELCOME TO AURA</Text>
              <Text style={styles.sourceTitle}>How should we get your music?</Text>
              <Text style={styles.sourceSubtitle}>
                AURA is local-first. We can index your device files or provide high-fidelity demo tracks.
              </Text>

              {/* Option 1: Device Music */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleImportDevice}
                style={styles.sourceCard}
              >
                <View style={styles.sourceIconWrapper}>
                  <Ionicons name="musical-notes" size={24} color="#00D2FF" />
                </View>
                <View style={styles.sourceMeta}>
                  <Text style={styles.sourceCardTitle}>🎵 Import Device Music</Text>
                  <Text style={styles.sourceCardDesc}>Scan your device media library</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </TouchableOpacity>

              {/* Option 2: Choose folder */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleImportDevice}
                style={styles.sourceCard}
              >
                <View style={styles.sourceIconWrapper}>
                  <Ionicons name="folder-outline" size={24} color="#7952FC" />
                </View>
                <View style={styles.sourceMeta}>
                  <Text style={styles.sourceCardTitle}>📁 Choose Music Folder</Text>
                  <Text style={styles.sourceCardDesc}>Select a specific folder or downloads</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </TouchableOpacity>

              <View style={styles.orDivider}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
              </View>

              {/* Option 3: Demo Music */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleDemoMusic}
                style={[styles.sourceCard, styles.demoCard]}
              >
                <View style={[styles.sourceIconWrapper, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                  <Ionicons name="sparkles" size={24} color="#EC4899" />
                </View>
                <View style={styles.sourceMeta}>
                  <Text style={styles.sourceCardTitle}>✨ Continue with Demo Music</Text>
                  <Text style={styles.sourceCardDesc}>
                    Preloaded high-res tracks, lyrics, & mood tags
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color="#EC4899" />
              </TouchableOpacity>
            </View>

            <View />
          </View>
        )}
      </SafeAreaView>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  centerHero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auraOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 8,
  },
  eyebrow: {
    color: '#00D2FF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  tagline: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
  startBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  startBtnText: {
    color: '#08080B',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  sourceHero: {
    paddingTop: 20,
  },
  sourceEyebrow: {
    color: '#00D2FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  sourceTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  sourceSubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  demoCard: {
    borderColor: 'rgba(236, 72, 153, 0.3)',
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
  },
  sourceIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sourceMeta: {
    flex: 1,
  },
  sourceCardTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  sourceCardDesc: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  orText: {
    color: Colors.textMuted,
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
