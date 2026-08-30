# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

# @rific/timer

Animated SVG progress-ring timer for React Native. A single controlled component: pass an ISO timestamp to `started` to run the ring from `startProgress` to full over `duration` seconds, `null` to stop it.

Part of the `@rific` package ecosystem. Published at https://www.npmjs.com/package/@rific/timer.

## Commands

```bash
npm run lint        # ESLint check
npm run fix         # ESLint --fix
npm test            # Jest
npm run test:watch  # Jest in watch mode
npm run typecheck   # TypeScript type check (tsc --noEmit)
npm run build       # tsup → dist/ (CJS + ESM + .d.ts)
npm run build:watch # tsup --watch
npm run verify      # lint + test + typecheck + build, in that order
```

Always run `npm run lint` before finishing any task.

## Release

Tag-based, using npm trusted publishing (OIDC, no token required):

```bash
npm run release:patch   # npm version patch && git push --follow-tags (or release:minor / release:major)
```

`preversion` runs `npm run verify` first. The `publish.yml` workflow fires on `v*` tags and delegates to the shared reusable workflow (`infinitetoken/Workflows/.github/workflows/npm-publish.yml@v1`) with `id-token: write` permission for OIDC trusted publishing.

## Architecture

```
src/
  index.ts                  - public exports: Timer, TimerProps
  Timer.tsx                 - the component
  __mocks__/
    react-native.ts         - jest mock: Animated (Value/timing/spring/createAnimatedComponent), Easing, StyleSheet, Platform, View/Text/Pressable/TouchableOpacity stubs
    react-native-svg.ts     - jest mock: Svg/G/Defs/Stop/ClipPath stubs, Circle/Rect render null
  __tests__/
    Timer.test.tsx           - rendering + start/stop/duration/startProgress behavior (9 tests)
```

### How it works

Driven by React Native's built-in `Animated` API (not Reanimated) — a single `Animated.Value` interpolated from `[0, 1]` to `[circumference, 0]` and fed to an `AnimatedCircle`'s `strokeDashoffset`, so the ring draws itself as the value advances.

One `useEffect` compares `started`/`duration`/`startProgress` against refs holding their previous values:
- `duration === 0`, or `started` is falsy → `stopTimer()` (stop in place, spring back to 0)
- `started` is truthy and any of the three changed → `animation.stopAnimation(() => startTimer())`

`startTimer` clamps `startProgress` to `[0, 1]`, jumps the animated value straight to that clamped progress (`animation.setValue`), computes the remaining duration as `(1 - clampedProgress) * duration * 1000`ms, then runs `Animated.timing` with `Easing.linear` over that remaining span — so resuming from a nonzero `startProgress` takes proportionally less time, not the full `duration`. `onStart` fires synchronously when `startTimer` runs; `onStop` fires from the animation's completion callback only if it finished naturally (not on manual stop).

## Public API

From `src/index.ts`:

- `Timer` — the component (`color`, `duration`, `radius`, `started` required; `children`, `onStart`, `onStop`, `startProgress`, `style`, `width` optional)
- `TimerProps` (type only) — its props shape

## Peer Dependencies

- `react` >=19.0.0
- `react-native` >=0.76.0
- `react-native-svg` >=15.0.0

## Testing

- Framework: Jest (`@infinitetoken/jest-config/react-native`), jsdom environment, via `@testing-library/react`
- Mocks in `src/__mocks__/` for `react-native` and `react-native-svg`
- 9 tests in 1 suite (`Timer.test.tsx`)

## Code Style

Enforced by ESLint + Prettier, run `npm run lint` before finishing any task.

**Prettier config:**
- Single quotes, JSX single quotes
- No semicolons
- No trailing commas
- Print width: 1000 (effectively disabled)

**ESLint rules (warnings unless noted):**
- `simple-import-sort` — imports and exports must be sorted
- `react-native/no-inline-styles` — no inline style objects
- `react-native/no-unused-styles` — no unused StyleSheet entries
- `no-console` — no console statements
- `@typescript-eslint/no-unused-vars` — `_`-prefixed vars/args/caught errors are exempt
- `react-hooks/rules-of-hooks` — error, not a warning
- `react-hooks/exhaustive-deps`, `react-hooks/refs`, `react-hooks/immutability`, `react-hooks/preserve-manual-memoization`, `react-hooks/set-state-in-effect`
- `package-json/order-properties`, `package-json/sort-collections` — on `package.json` itself

`eslint.config.cjs` is a bare `require('@infinitetoken/eslint-config/react-native')` — no local overrides. `src/__mocks__` and `src/__tests__` are linted normally (not excluded).
