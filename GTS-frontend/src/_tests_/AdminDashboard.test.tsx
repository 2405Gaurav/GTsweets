import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminDashboard } from '../pages/AdminDashboard'
import { AuthContext } from '../contexts/AuthContext'

const renderWithAuth = (authValue: any) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('AdminDashboard access control', () => {
  it('renders dashboard for admin user', () => {
    renderWithAuth({
      user: { id: '1', role: 'admin' },
      isAuthenticated: true,
      isAdmin: true,
      isLoading: false,
    })

    expect(
      screen.getByText(/admin dashboard/i)
    ).toBeInTheDocument()
  })

  it('blocks non-admin users', () => {
    renderWithAuth({
      user: { id: '1', role: 'customer' },
      isAuthenticated: true,
      isAdmin: false,
      isLoading: false,
    })

    expect(
      screen.getByText(/not authorized/i)
    ).toBeInTheDocument()
  })

  it('redirects unauthenticated users', () => {
    renderWithAuth({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    })

    expect(
      screen.getByText(/login/i)
    ).toBeInTheDocument()
  })
})

describe('AdminDashboard UI', () => {
  it('shows admin management actions', () => {
    renderWithAuth({
      user: { id: '1', role: 'admin' },
      isAuthenticated: true,
      isAdmin: true,
      isLoading: false,
    })

    expect(
      screen.getByText(/manage sweets/i)
    ).toBeInTheDocument()
  })
})
