import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import AnecdoteList from './AnecdoteList'
import { useAnecdoteStore } from '../store'

describe('AnecdoteList', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: [
        { content: 'High votes', id: '1', votes: 10 },
        { content: 'Low votes', id: '2', votes: 1 },
      ],
      filter: '',
    })
    vi.clearAllMocks()
  })

  it('should display anecdotes sorted by votes in descending order', () => {
    render(<AnecdoteList />)

    const contentElements = screen.getAllByText(/votes$/, { exact: false })
    expect(contentElements[0]).toContainHTML('High votes')
    expect(contentElements[1]).toContainHTML('Low votes')
  })

  it('should display only anecdotes matching the filter', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { content: 'React is fun', id: '1', votes: 3 },
        { content: 'Redux is powerful', id: '2', votes: 5 },
        { content: 'Vue is easy', id: '3', votes: 1 },
      ],
      filter: 'react',
    })

    render(<AnecdoteList />)

    const matchingElements = screen.queryAllByText('React is fun')
    expect(matchingElements.length).toBeGreaterThan(0)
    expect(screen.queryByText('Redux is powerful')).toBeNull()
    expect(screen.queryByText('Vue is easy')).toBeNull()
  })
})