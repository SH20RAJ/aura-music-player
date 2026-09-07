# Contributing to AURA 🎧

First off, thank you for considering contributing to **AURA**! It's people like you that make open source such an extraordinary tool for the global developer and music-loving community.

## 📜 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Guidelines](#pull-request-guidelines)
5. [Coding Standards](#coding-standards)

---

## Code of Conduct
This project and everyone participating in it is governed by the [AURA Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Getting Started

1. **Fork the repo** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/aura-music-player.git
   cd aura-music-player
   ```
3. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
4. **Create a topic branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## Development Workflow

- Run the dev server:
  ```bash
  npx expo start
  ```
- Always ensure TypeScript types are sound before committing:
  ```bash
  npx tsc --noEmit
  ```
- Verify web export compilation:
  ```bash
  npx expo export --platform web
  ```

---

## Pull Request Guidelines

1. **Title convention**: Use Conventional Commits (`feat:`, `fix:`, `docs:`, `perf:`, `refactor:`, `chore:`).
2. **Keep PRs focused**: One feature or bug fix per pull request.
3. **Include screenshots / recordings** when changing visual UI components (Full Player, Mini Player, Tabs, etc.).
4. **Link relevant issues** in your pull request description (e.g. `Closes #12`).

---

## Coding Standards

- **TypeScript**: Strict type checking is enabled. Avoid `any` where possible.
- **Styling**: Adhere to the design system in `src/constants/theme.ts`:
  - Background: `#08080B`
  - Cards: `#121217`
  - Text: `#F7F7FA`
  - Muted: `#8B8B98`
- **Audio Architecture**: Never couple UI directly to audio hardware; always route through `features/player/player-store.ts` or `features/player/audio-engine.ts`.
