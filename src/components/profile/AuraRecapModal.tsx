import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { AnalyticsEngine } from '../../features/recommendations/analytics-engine';
import { useHaptics } from '../../hooks/useHaptics';

const { width, height } = Dimensions.get('window');
const TOTAL_SLIDES = 4;

interface AuraRecapModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuraRecapModal: React.FC<AuraRecapModalProps> = ({ visible, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const tracks = useLibraryStore((state) => state.tracks);
  const albums = useLibraryStore((state) => state.albums);
  const artists = useLibraryStore((state) => state.artists);
  const recentlyPlayed = useLibraryStore((state) => state.recentlyPlayed);
  const haptics = useHaptics();

  const personality = AnalyticsEngine.calculateListeningPersonality(tracks, recentlyPlayed);
  const topArtist = AnalyticsEngine.getTopArtist(tracks);

  const handleNext = () => {
    haptics.selection();
    if (currentSlide < TOTAL_SLIDES - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    haptics.selection();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleShare = async () => {
    haptics.medium();
    try {
      await Share.share({
        message: `My AURA 2026 Sonic Identity: ${personality.title} ✦ Top Artist: ${topArtist.name}. Listened to ${tracks.length} songs on AURA 🎧`,
      });
    } catch {}
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Dynamic Story Background Gradient */}
        <LinearGradient
          colors={
            currentSlide === 0
              ? ['#1A0B2E', '#0B132B', '#08080B']
              : currentSlide === 1
              ? ['#2D0B14', '#1A0B2E', '#08080B']
              : currentSlide === 2
              ? ['#0B2B24', '#1A162B', '#08080B']
              : ['#2A1803', '#1A0B2E', '#08080B']
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />

        {/* Top Progress Segment Bars */}
        <View style={styles.progressBarRow}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
            <View key={idx} style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: idx < currentSlide ? '100%' : idx === currentSlide ? '100%' : '0%',
                    backgroundColor: idx <= currentSlide ? '#FFFFFF' : 'transparent',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            haptics.light();
            onClose();
          }}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Slide Content */}
        <View style={styles.contentContainer}>
          {/* Slide 1: Sonic Universe */}
          {currentSlide === 0 && (
            <View style={styles.slideCenter}>
              <Text style={styles.slideEyebrow}>YOUR 2026 RECAP</Text>
              <Text style={styles.slideHero}>Your Sonic Universe</Text>
              <Text style={styles.slideDesc}>
                This year, you moved through pure sound.
              </Text>

              <View style={styles.bigStatBox}>
                <Text style={styles.bigStatNumber}>{tracks.length}</Text>
                <Text style={styles.bigStatUnit}>TOTAL SONGS PLAYED</Text>
              </View>

              <View style={styles.miniStatsRow}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNum}>{artists.length}</Text>
                  <Text style={styles.miniStatLbl}>ARTISTS</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNum}>{albums.length}</Text>
                  <Text style={styles.miniStatLbl}>ALBUMS</Text>
                </View>
              </View>
            </View>
          )}

          {/* Slide 2: Sovereign Artist */}
          {currentSlide === 1 && (
            <View style={styles.slideCenter}>
              <Text style={styles.slideEyebrow}>THE SOUNDTRACK OF YOUR SOUL</Text>
              <Text style={styles.slideHero}>Your #1 Artist</Text>

              <View style={styles.shrineCircle}>
                <Ionicons name="musical-notes" size={60} color="#FF4D4D" />
              </View>

              <Text style={styles.topArtistTitle}>{topArtist.name}</Text>
              <Text style={styles.topArtistSubtitle}>
                You couldn't stop coming back to their soundscape.
              </Text>

              <View style={styles.reverenceBadge}>
                <Text style={styles.reverenceText}>✦ REVERED ROTATION</Text>
              </View>
            </View>
          )}

          {/* Slide 3: Chromatic Atmosphere */}
          {currentSlide === 2 && (
            <View style={styles.slideCenter}>
              <Text style={styles.slideEyebrow}>SONIC SPECTRUM</Text>
              <Text style={styles.slideHero}>Your Chromatic Aura</Text>
              <Text style={styles.slideDesc}>
                Your listening wasn't just heard — it had a visual atmosphere.
              </Text>

              <View style={styles.palettePillContainer}>
                <LinearGradient
                  colors={['#7928CA', '#00DFD8', '#FF0080']}
                  style={styles.gradientSpectrum}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.spectrumText}>Electric Midnight Indigo</Text>
                  <Text style={styles.spectrumSub}>Dominated by deep synthwave & soul</Text>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Slide 4: Personality Badge */}
          {currentSlide === 3 && (
            <View style={styles.slideCenter}>
              <Text style={styles.slideEyebrow}>YOUR ARCHETYPE</Text>
              <Text style={styles.slideHero}>{personality.title}</Text>

              <View style={styles.badgeCard}>
                <View style={styles.badgeIcon}>
                  <Text style={{ fontSize: 44 }}>🌙</Text>
                </View>
                <Text style={styles.badgeTitle}>{personality.title.toUpperCase()}</Text>
                <Text style={styles.badgeSub}>{personality.subtitle}</Text>
                <View style={styles.badgeDivider} />
                <Text style={styles.badgePeak}>Peak Listening: {personality.peakListeningTime}</Text>
              </View>

              <TouchableOpacity activeOpacity={0.85} onPress={handleShare} style={styles.shareBtn}>
                <Ionicons name="share-social" size={18} color="#08080B" style={{ marginRight: 6 }} />
                <Text style={styles.shareBtnText}>Share My AURA</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tap areas: left = prev, right = next */}
        <View style={styles.tapAreaContainer} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={handlePrev}>
            <View style={styles.tapHalf} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={handleNext}>
            <View style={styles.tapHalf} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08080B',
    paddingTop: 54,
  },
  progressBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    zIndex: 10,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 5,
  },
  slideCenter: {
    alignItems: 'center',
    width: '100%',
  },
  slideEyebrow: {
    color: '#00D2FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  slideHero: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  slideDesc: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 36,
  },
  bigStatBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.xl,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 24,
  },
  bigStatNumber: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '900',
  },
  bigStatUnit: {
    color: '#00D2FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  miniStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatNum: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  miniStatLbl: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  shrineCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 77, 77, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 77, 77, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  topArtistTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  topArtistSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  reverenceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  reverenceText: {
    color: '#FF4D4D',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  palettePillContainer: {
    width: '100%',
    alignItems: 'center',
  },
  gradientSpectrum: {
    width: '100%',
    height: 220,
    borderRadius: BorderRadius.xl,
    padding: 24,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  spectrumText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  spectrumSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
  },
  badgeCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 28,
  },
  badgeIcon: {
    marginBottom: 12,
  },
  badgeTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  badgeSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  badgeDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  badgePeak: {
    color: '#00D2FF',
    fontSize: 13,
    fontWeight: '700',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  shareBtnText: {
    color: '#08080B',
    fontSize: 15,
    fontWeight: '800',
  },
  tapAreaContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 1,
  },
  tapHalf: {
    flex: 1,
    height: '100%',
  },
});
