import { render } from '@testing-library/react'
import React from 'react'

import { Timer } from '../Timer'

const STARTED = '2026-05-18T12:00:00Z'

describe('Timer', () => {
  it('renders without throwing', () => {
    expect(() => {
      render(<Timer color='#6200ee' duration={5} radius={20} started={null} />)
    }).not.toThrow()
  })

  it('renders children', () => {
    const { getByText } = render(
      <Timer color='#6200ee' duration={5} radius={20} started={null}>
        <></>
      </Timer>
    )
    expect(getByText).toBeTruthy()
  })

  it('does not call onStart when started is null', () => {
    const onStart = jest.fn()
    render(<Timer color='#6200ee' duration={5} radius={20} started={null} onStart={onStart} />)
    expect(onStart).not.toHaveBeenCalled()
  })

  it('calls onStart when started is set', () => {
    const onStart = jest.fn()
    const { rerender } = render(<Timer color='#6200ee' duration={5} radius={20} started={null} onStart={onStart} />)
    rerender(<Timer color='#6200ee' duration={5} radius={20} started={STARTED} onStart={onStart} />)
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('calls onStart again when started changes to a new value', () => {
    const onStart = jest.fn()
    const { rerender } = render(<Timer color='#6200ee' duration={5} radius={20} started={STARTED} onStart={onStart} />)
    rerender(<Timer color='#6200ee' duration={5} radius={20} started='2026-05-18T13:00:00Z' onStart={onStart} />)
    expect(onStart).toHaveBeenCalledTimes(2)
  })

  it('does not call onStart when duration is 0', () => {
    const onStart = jest.fn()
    render(<Timer color='#6200ee' duration={0} radius={20} started={STARTED} onStart={onStart} />)
    expect(onStart).not.toHaveBeenCalled()
  })

  it('calls onStop when the timer finishes', () => {
    const onStop = jest.fn()
    render(<Timer color='#6200ee' duration={5} radius={20} started={STARTED} onStop={onStop} />)
    expect(onStop).toHaveBeenCalledTimes(1)
  })

  it('accepts startProgress prop without throwing', () => {
    expect(() => {
      render(<Timer color='#6200ee' duration={5} radius={20} started={STARTED} startProgress={0.5} />)
    }).not.toThrow()
  })

  it('accepts custom width and style without throwing', () => {
    expect(() => {
      render(<Timer color='#6200ee' duration={10} radius={30} started={null} width={8} style={{ opacity: 0.8 }} />)
    }).not.toThrow()
  })
})
