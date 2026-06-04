import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '12345',
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  const renderBlog = (user) => {
    return render(
      <MemoryRouter>
        <Blog
          blog={blog}
          handleLike={() => {}}
          handleDelete={() => {}}
          user={user}
        />
      </MemoryRouter>
    )
  }

  it('renders title and author but not url or likes by default', () => {
    const { container } = renderBlog(null)

    const titleElement = container.querySelector('.blog-title')
    expect(titleElement).not.toBeNull()
    expect(titleElement.textContent).toBe('Test Blog Title')

    const authorElement = container.querySelector('.blog-author')
    expect(authorElement).not.toBeNull()
    expect(authorElement.textContent).toBe('Test Author')

    const urlElement = container.querySelector('.blog-url')
    expect(urlElement).toBeNull()

    const likesElement = container.querySelector('.blog-likes')
    expect(likesElement).toBeNull()
  })

  describe('when expanded', () => {
    it('shows blog info and likes to unauthenticated users, buttons are not displayed', async () => {
      const { container } = renderBlog(null)

      const viewButton = screen.getByText('view')
      await userEvent.setup().click(viewButton)

      const urlElement = container.querySelector('.blog-url')
      expect(urlElement).not.toBeNull()
      expect(urlElement.textContent).toBe('http://test.com')

      const likesElement = container.querySelector('.blog-likes')
      expect(likesElement).not.toBeNull()
      expect(likesElement.textContent).toContain('likes 5')

      // like 和 remove 按钮不应该显示
      const likeButton = screen.queryByText('like')
      expect(likeButton).toBeNull()

      const removeButton = screen.queryByText('remove')
      expect(removeButton).toBeNull()
    })

    it('shows only the like button to authenticated users who are not the creator', async () => {
      renderBlog({ username: 'otheruser', name: 'Other User' })

      const viewButton = screen.getByText('view')
      await userEvent.setup().click(viewButton)

      // like 按钮应该显示
      const likeButton = screen.queryByText('like')
      expect(likeButton).not.toBeNull()

      // remove 按钮不应该显示
      const removeButton = screen.queryByText('remove')
      expect(removeButton).toBeNull()
    })

    it('shows both like and delete buttons to the blog creator', async () => {
      renderBlog({ username: 'testuser', name: 'Test User' })

      const viewButton = screen.getByText('view')
      await userEvent.setup().click(viewButton)

      const likeButton = screen.queryByText('like')
      expect(likeButton).not.toBeNull()

      const removeButton = screen.queryByText('remove')
      expect(removeButton).not.toBeNull()
    })
  })

  it('calls handleLike twice when the like button is clicked twice', async () => {
    const mockHandleLike = vi.fn()

    render(
      <MemoryRouter>
        <Blog
          blog={blog}
          handleLike={mockHandleLike}
          handleDelete={() => {}}
          user={{ username: 'testuser', name: 'Test User' }}
        />
      </MemoryRouter>
    )

    // 先展开详情
    const viewButton = screen.getByText('view')
    await userEvent.setup().click(viewButton)

    // 点击 like 按钮两次
    const likeButton = screen.getByText('like')
    await userEvent.setup().click(likeButton)
    await userEvent.setup().click(likeButton)

    expect(mockHandleLike).toHaveBeenCalledTimes(2)
  })
})