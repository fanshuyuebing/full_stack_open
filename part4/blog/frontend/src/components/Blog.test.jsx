import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  it('renders title and author but not url or likes by default', () => {
    const { container } = render(
      <Blog
        blog={blog}
        handleLike={() => {}}
        handleDelete={() => {}}
        user={null}
      />
    )

    // 标题和作者应该渲染
    const titleElement = container.querySelector('.blog-title')
    expect(titleElement).not.toBeNull()
    expect(titleElement.textContent).toBe('Test Blog Title')

    const authorElement = container.querySelector('.blog-author')
    expect(authorElement).not.toBeNull()
    expect(authorElement.textContent).toBe('Test Author')

    // URL 和 likes 默认不应该渲染
    const urlElement = container.querySelector('.blog-url')
    expect(urlElement).toBeNull()

    const likesElement = container.querySelector('.blog-likes')
    expect(likesElement).toBeNull()
  })

  it('shows url and likes when the view button is clicked', async () => {
    const { container } = render(
      <Blog
        blog={blog}
        handleLike={() => {}}
        handleDelete={() => {}}
        user={null}
      />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = container.querySelector('.blog-url')
    expect(urlElement).not.toBeNull()
    expect(urlElement.textContent).toBe('http://test.com')

    const likesElement = container.querySelector('.blog-likes')
    expect(likesElement).not.toBeNull()
    expect(likesElement.textContent).toContain('likes 5')
  })

  it('calls handleLike twice when the like button is clicked twice', async () => {
    const mockHandleLike = vi.fn()

    render(
      <Blog
        blog={blog}
        handleLike={mockHandleLike}
        handleDelete={() => {}}
        user={null}
      />
    )

    const user = userEvent.setup()

    // 先展开详情
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // 点击 like 按钮两次
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandleLike).toHaveBeenCalledTimes(2)
  })
})