/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

const stub = ({ children }: { children?: React.ReactNode }) => children ?? null

const noop = () => {}

class AnimatedValue {
  constructor(_v: number) {}
  setValue(_v: number) {}
  stopAnimation(cb?: () => void) {
    cb?.()
  }
  interpolate(_config: unknown) {
    return {}
  }
}

const animatedObj = {
  start: (cb?: ({ finished }: { finished: boolean }) => void) => {
    cb?.({ finished: true })
  },
  stop: noop,
  reset: noop
}

const Animated = {
  Value: AnimatedValue,
  createAnimatedComponent: <T>(C: T): T => C,
  timing: (_value: unknown, _config: unknown) => animatedObj,
  spring: (_value: unknown, _config: unknown) => animatedObj,
  loop: (_anim: unknown) => animatedObj,
  sequence: (_anims: unknown[]) => animatedObj,
  View: stub
}

const Easing = {
  linear: (t: number) => t,
  inOut: (fn: unknown) => fn
}

const StyleSheet = {
  create: <T extends object>(styles: T): T => styles,
  flatten: (style: unknown) => style
}

const Platform = {
  OS: 'ios',
  select: (obj: Record<string, unknown>) => obj.ios ?? obj.default
}

export { Animated, Easing, Platform, StyleSheet }

export const View = stub
export const Text = stub
export const Pressable = stub
export const TouchableOpacity = stub
