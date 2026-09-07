<div align="center">

# 🎧 AURA
### *Music that moves with you.*

<p align="center">
  <a href="https://github.com/shaswatraj/aura-music-player">
    <img src="https://visitor-badge.laobi.icu/badge?page_id=shaswatraj.aura-music-player&title=Visitors&color=7952FC" alt="Visitor Badge" />
  </a>
  <a href="https://github.com/shaswatraj/aura-music-player/stargazers">
    <img src="https://img.shields.io/github/stars/shaswatraj/aura-music-player?style=flat&color=00D2FF" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/shaswatraj/aura-music-player/network/members">
    <img src="https://img.shields.io/github/forks/shaswatraj/aura-music-player?style=flat&color=7952FC" alt="GitHub Forks" />
  </a>
  <a href="https://github.com/shaswatraj/aura-music-player/issues">
    <img src="https://img.shields.io/github/issues/shaswatraj/aura-music-player?color=10B981" alt="Issues" />
  </a>
  <a href="https://github.com/shaswatraj/aura-music-player/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?color=3B82F6" alt="License: MIT" />
  </a>
  <a href="https://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=10B981" alt="PRs Welcome" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo_SDK-57-000020?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Platform-iOS_%7C_Android_%7C_Web-orange?logo=apple&logoColor=white" alt="Platforms" />
  <img src="https://img.shields.io/badge/Audio-expo--audio-purple" alt="expo-audio" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Code_Style-Prettier-F7B93E?logo=prettier&logoColor=black" alt="Code Style" />
</p>

<p align="center">
  <b>AURA</b> is a high-polish, local-first music player built around <b>mood, motion, and personal listening history</b>.<br/>
  Featuring cinematic dark glass aesthetics, dynamic album-reactive lighting, intelligent AURA Flow mood queues, synchronized lyrics, audio visualizers, and background audio playback.
</p>

---

</div>

## 🌟 The Philosophy

Forget the generic black screen + neon green Spotify clone. **AURA** is designed as a sanctuary for music you own:

- **Dark Cinematic Atmosphere**: `#08080B` obsidian deep canvas, `#121217` frosted card surfaces, `#F7F7FA` crisp typography.
- **Dynamic Chromatic Glow**: When playing a blue album, deep blue glows and cyan highlights emerge. When playing burgundy red, deep burgundy atmosphere and coral accents envelope the UI.
- **Organic Motion**: Subtle breathing album artwork, continuous progress scrubber, fluid bottom sheets, and responsive haptics.
- **Local-First Independence**: Powered by SQLite and `expo-audio` with zero telemetry, zero mandatory cloud logins, and no streaming lock-in.

---

## ✨ Features at a Glance

### 1. 🔮 AURA Flow (The Mood Engine)
Instead of a static list of songs, AURA asks: **"What's the vibe?"**
- ☀️ **Focus** — Serene ambient, lo-fi, and steady acoustic flow for deep work.
- 🌙 **Late Night** — Sub-bass, midnight synthwave, and brooding introspection.
- ⚡ **Energy** — High-tempo electronic, pulse-pounding workout adrenaline.
- 🫶 **Feels** — Emotive soul, indie ballads, and heartfelt resonance.
- 🚗 **Drive** — Night highways, retrowave cruisers, and steady beats.
- ☁️ **Chill** — Golden hour acoustic rhythms and downtempo lounge.
- ✦ **Discover** — Intelligent shuffle of hidden gems from your library.

### 2. 🎛️ Full Player Experience
- **Subtle Breathing Artwork**: The album cover breathes with gentle pulse animation while music is playing.
- **3-Way View Switcher**: Tap the artwork to cycle through:
  1. **Artwork** — High-res cover with dynamic chromatic backglow.
  2. **Lyrics** — Synced scrolling lyrics with timestamped active line glow and tap-to-seek.
  3. **Visualizer** — Audio-reactive animated frequency EQ spectrum bars.
- **Player Gestures**:
  - **Swipe Down** → Dismiss player.
  - **Swipe Left** → Next song.
  - **Swipe Right** → Previous song.
  - **Long Press Artwork** → Opens Song Actions (Add to playlist, favorites, play next, view artist/album, share).
- **Interactive Scrubber**: Continuous progress with elapsed & remaining time indicators.

### 3. 📑 Persistent Mini Player & Smart Queue
- **Persistent Mini Player**: Floats above all tab destinations with artwork, track info, quick play/pause, skip, and micro progress bar.
- **UP NEXT Queue Sheet**: Pull-up bottom sheet with manual reordering, swipe to remove, and **✨ AURA QUEUE** auto-continuation.

### 4. 🎨 Generative Playlists ("CREATE YOUR AURA")
- Craft playlists with personality. AURA automatically generates vibrant, multi-stop gradient covers based on your selected mood palette.

### 5. 📊 Listening Personality & Recap
- Minimalist profile calculating:
  - Total songs, albums, and unique artists.
  - Top Artist rotation.
  - **Listening Personality**: Analyzes listening timestamps to calculate profiles (e.g. *Night Owl — Peak: 11:00 PM – 1:00 AM*, *Dawn Seeker*, *Sunset Cruiser*).
  - *Your 2026* yearly listening recap teaser.

### 6. 📱 Native Background Playback & Lock Screen
- Configured with `expo-audio` background playback service.
- Lock screen media notifications with artwork, play, pause, previous, and skip controls.
- Tactile feedback powered by `expo-haptics`.

---

## 🏛 Architecture

```
AURA APP
│
├── UI Layer (Presentation)
│   ├── Screens (Home, Search, Library, Playlists, Profile, Player, Details)
│   ├── Components (AmbientGlow, ArtworkBreathing, AudioVisualizer, LyricsView)
│   ├── Mini Player Overlay
│   └── Gestures & Animations (Reanimated, PanResponder)
│
├── Domain Layer (Business Logic & Intelligence)
│   ├── Player Engine (expo-audio lifecycle, lock screen metadata)
│   ├── Queue Engine (shuffle, repeat, AURA auto-continuation)
│   ├── Library Engine (media scanner, demo catalog loader)
│   └── Recommendations (AuraEngine, AnalyticsEngine)
│
└── Data Layer (Storage & Hardware)
    ├── SQLite Database (tracks, albums, artists, playlists, history)
    ├── FileSystem (expo-file-system & expo-media-library)
    └── Hardware (expo-haptics, expo-audio native service)
```

### Directory Structure

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Glassmorphic 5-tab bar
│   │   ├── index.tsx             # Home: Greeting, Your Aura, Recently Played
│   │   ├── search.tsx            # Command center search & vibe filters
│   │   ├── library.tsx           # Library tabs (Songs/Albums/Artists/Favorites)
│   │   ├── playlists.tsx         # Playlists & Create Aura modal
│   │   └── profile.tsx           # Listening personality & stats
│   ├── _layout.tsx               # Root stack & persistent MiniPlayer
│   ├── player.tsx                # Full Player modal with gestures & visualizer
│   ├── album/[id].tsx            # Album detail view
│   ├── artist/[id].tsx           # Artist detail view
│   ├── playlist/[id].tsx         # Playlist detail view
│   └── onboarding.tsx            # First-launch experience
├── components/
│   ├── atmosphere/               # AmbientGlow, ArtworkBreathing, AudioVisualizer
│   ├── cards/                    # MoodCard, AlbumCard, TrackRow
│   ├── player/                   # MiniPlayer, PlayerControls, ProgressBar, LyricsView, QueueBottomSheet
│   └── playlists/                # CreatePlaylistModal
├── features/
│   ├── player/                   # audio-engine, queue-engine, player-store
│   ├── library/                  # library-store, scanner, demo-catalog
│   └── recommendations/          # aura-engine, analytics-engine
├── db/                           # schema.ts, database.ts, database.web.ts
├── constants/                    # theme.ts, moods.ts
├── hooks/                        # useAtmosphereColor, useHaptics
└── types/                        # track.ts, player.ts, mood.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `20.x` or later (tested on Node v24)
- npm or pnpm
- Expo Go app or an iOS/Android simulator

### Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shaswatraj/aura-music-player.git
   cd aura-music-player
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on your target platform:**
   - **iOS Simulator**: Press `i`
   - **Android Emulator**: Press `a`
   - **Web Browser**: Press `w`
   - **Physical Device**: Scan the QR code using the Expo Go camera (Android) or Camera app (iOS).

---

## 🧪 Testing & Validation

```bash
# Type checking
npx tsc --noEmit

# Production web bundle build test
npx expo export --platform web

# Run linter
npm run lint
```

---

## 🗺 Roadmap

- [x] **Phase 1: Foundation** — Expo Router, Dark Theme tokens, SQLite database, Zustand stores.
- [x] **Phase 2: Audio Engine** — `expo-audio` background playback, lock-screen controls, Queue manager.
- [x] **Phase 3: Visual Identity** — Breathing artwork, Dynamic atmosphere glow, Synced lyrics, Audio visualizer.
- [x] **Phase 4: Library & Scanner** — Device audio import, Demo catalog, Sorting and tab views.
- [x] **Phase 5: Playlists & Queue** — Generative gradient covers, drag/reorder bottom sheet.
- [x] **Phase 6: AURA Flow Intelligence** — Mood capsules, recommendation scoring, listening personality.
- [ ] **Phase 7: Cloud & Cross-Device Sync** — Peer-to-peer local WiFi sync, WebDAV / self-hosted backup.
- [ ] **Phase 8: Offline High-Res FLAC** — Bit-perfect DAC playback & embedded artwork caching.

---

## 🤝 Contributing

Contributions make the open-source community an incredible place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Crafted with passion for music lovers everywhere. Built with React Native & Expo.</sub>
</div>
