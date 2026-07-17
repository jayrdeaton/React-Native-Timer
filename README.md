# @rific/timer

Animated SVG progress ring timer for React Native.

## Installation

```sh
npm install @rific/timer react-native-svg
```

## Usage

```tsx
import { Timer } from '@rific/timer'
import { Text } from 'react-native'

const [started, setStarted] = useState<string | null>(null)

<Timer
  color='#6200ee'
  duration={30}
  radius={28}
  started={started}
  onStart={() => console.log('started')}
  onStop={() => setStarted(null)}
>
  <Text>30s</Text>
</Timer>

<Button title='Start' onPress={() => setStarted(new Date().toISOString())} />
```

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `color` | `string` | ✓ | — | Stroke color of the progress ring |
| `duration` | `number` | ✓ | — | Timer duration in seconds |
| `radius` | `number` | ✓ | — | Radius of the SVG ring in pixels |
| `started` | `string \| null` | ✓ | — | ISO timestamp when the timer started; `null` to stop |
| `children` | `ReactNode` | | `undefined` | Rendered in the center of the ring |
| `onStart` | `() => void` | | `undefined` | Called when the timer starts |
| `onStop` | `() => void` | | `undefined` | Called when the timer reaches 100% |
| `startProgress` | `number` | | `0` | Starting progress (0–1) |
| `style` | `ViewStyle` | | `undefined` | Style applied to the container |
| `width` | `number` | | `6` | Stroke width of the ring |

## How it works

Pass an ISO timestamp string to `started` to begin the countdown. Set `started` to `null` to reset. The ring animates from empty to full over `duration` seconds and calls `onStop` on completion.

## Peer dependencies

- `react >= 18.0.0`
- `react-native >= 0.76.0`
- `react-native-svg >= 13.0.0`
