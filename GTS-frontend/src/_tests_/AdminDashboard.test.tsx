import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminDashboard } from '../pages/AdminDashboard'
import { AuthProvider } from '../contexts/AuthContext'

const renderWithAuth = () => {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('AdminDashboard access control', () => {
  it('renders dashboard for admin user', () => {
    renderWithAuth()

    expect(
      screen.getByText(/admin dashboard/i)
    ).toBeInTheDocument()
  })

  it('blocks non-admin users', () => {
    renderWithAuth()

    expect(
      screen.getByText(/not authorized/i)
    ).toBeInTheDocument()
  })

  it('redirects unauthenticated users', () => {
    renderWithAuth()

    expect(
      screen.getByText(/login/i)
    ).toBeInTheDocument()
  })
})

describe('AdminDashboard UI', () => {
  it('shows admin management actions', () => {
    renderWithAuth()

    expect(
      screen.getByText(/manage sweets/i)
    ).toBeInTheDocument()
  })
})