import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import { useAnecdoteStore } from './store'

const mockAnecdotes = [
  { content: 'Mock anecdote 1', id: '1', votes: 1 },
  { content: 'Mock anecdote 2', id: '2', votes: 10 },
]

describe('useAnecdoteStore', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
  })

  it('should initialize anecdotes sorted by votes in descending order', async () => {
    vi.mocked(anecdoteService.getAll).mockResolvedValue(mockAnecdotes)

    await useAnecdoteStore.getState().actions.initialize()

    expect(anecdoteService.getAll).toHaveBeenCalledTimes(1)
    expect(useAnecdoteStore.getState().anecdotes).toEqual([
      { content: 'Mock anecdote 2', id: '2', votes: 10 },
      { content: 'Mock anecdote 1', id: '1', votes: 1 },
    ])
  })
})