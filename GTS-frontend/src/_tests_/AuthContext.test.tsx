import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { authApi } from '../../services/api'

vi.mock('../../services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

const TestComponent = () => {
  const { login, logout, isAuthenticated, isAdmin } = useAuth()

  return (
    <>
      <span>{isAuthenticated ? 'AUTH' : 'NO_AUTH'}</span>
      <span>{isAdmin ? 'ADMIN' : 'USER'}</span>
      <button
        onClick={() =>
          login({ email: 'a@b.com', password: '123456' })
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('logs in and updates auth state', async () => {
    ;(authApi.login as any).mockResolvedValue({
      token: 'token123',
      user: { id: '1', email: 'a@b.com', role: 'user' },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Login'))

    await waitFor(() =>
      expect(screen.getByText('AUTH')).toBeInTheDocument()
    )
  })

  it('sets isAdmin when user role is admin', async () => {
    ;(authApi.login as any).mockResolvedValue({
      token: 'token123',
      user: { id: '1', email: 'admin@b.com', role: 'admin' },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Login'))

    await waitFor(() =>
      expect(screen.getByText('ADMIN')).toBeInTheDocument()
    )
  })

  it('logs out and clears auth state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('Logout'))

    expect(screen.getByText('NO_AUTH')).toBeInTheDocument()
  })
})
