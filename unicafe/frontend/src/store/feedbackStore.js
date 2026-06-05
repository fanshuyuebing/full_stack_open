import { create } from 'zustand'

const useFeedbackStore = create((set) => ({
  counters: {
    good: 0,
    neutral: 0,
    bad: 0,
  },
  actions: {
    setGood: () => set((state) => ({ counters: { ...state.counters, good: state.counters.good + 1 } })),
    setNeutral: () => set((state) => ({ counters: { ...state.counters, neutral: state.counters.neutral + 1 } })),
    setBad: () => set((state) => ({ counters: { ...state.counters, bad: state.counters.bad + 1 } })),
  }
}))

export const useCounter = () => useFeedbackStore(state => state.counters)
export const useCounterControls = () => useFeedbackStore(state => state.actions)
