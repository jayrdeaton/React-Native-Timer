import { type ReactNode, useCallback, useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const useNativeDriver = true

export type TimerProps = {
  children?: ReactNode
  color: string
  duration: number
  onStart?: () => void
  onStop?: () => void
  radius: number
  startProgress?: number
  started: string | null
  style?: ViewStyle
  width?: number
}

export const Timer = ({ children, color, duration, onStart, onStop, radius, startProgress = 0, started, style, width = 6 }: TimerProps) => {
  const durationRef = useRef(duration)
  const progressRef = useRef(startProgress)
  const startedRef = useRef<string | null>(null)
  const circumference = 2 * Math.PI * radius
  const animation = useRef(new Animated.Value(0)).current
  const animatedProps = {
    strokeDashoffset: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [circumference, 0]
    })
  }
  const startTimer = useCallback(
    (callback?: () => void) => {
      const clampedProgress = Math.max(0, Math.min(1, startProgress))
      const remainingDurationMs = Math.max(0, duration * 1000 * (1 - clampedProgress))
      animation.setValue(clampedProgress)
      if (onStart) onStart()
      Animated.timing(animation, {
        toValue: 1,
        duration: remainingDurationMs,
        easing: Easing.linear,
        useNativeDriver
      }).start(({ finished }) => {
        if (finished && onStop) onStop()
        if (callback) callback()
      })
    },
    [animation, duration, onStart, onStop, startProgress]
  )
  const stopTimer = useCallback(
    (callback?: () => void) => {
      animation.stopAnimation()
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver
      }).start(callback)
    },
    [animation]
  )
  useEffect(() => {
    const startedChanged = started !== startedRef.current
    const durationChanged = duration !== durationRef.current
    const progressChanged = startProgress !== progressRef.current

    if (duration === 0) {
      stopTimer()
    } else if (started) {
      if (startedChanged || durationChanged || progressChanged) {
        animation.stopAnimation(() => startTimer())
      }
    } else {
      stopTimer()
    }
    durationRef.current = duration
    progressRef.current = startProgress
    startedRef.current = started
  }, [animation, duration, startProgress, started, startTimer, stopTimer])
  return (
    <View style={[style, styles.root]}>
      <Svg width={radius * 2 + width} height={radius * 2 + width} viewBox={`0 0 ${radius * 2 + width} ${radius * 2 + width}`} style={styles.svg}>
        <G rotation='-90' origin={`${radius + width / 2}, ${radius + width / 2}`}>
          <AnimatedCircle cx={radius + width / 2} cy={radius + width / 2} r={radius} stroke={color} strokeWidth={width} fill='none' strokeDasharray={circumference} {...animatedProps} />
        </G>
      </Svg>
      <View style={styles.children}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  children: {
    position: 'absolute'
  },
  root: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  svg: {}
})
