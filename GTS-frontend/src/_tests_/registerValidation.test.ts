import { describe, it, expect } from 'vitest'
import { validateRegister } from '../pages/Register'

describe('validateRegister', () => {
  it('fails when name is empty', () => {
    expect(
      validateRegister('', 'a@b.com', '123456')
    ).toBe('Name is required')
  })

  it('fails when email is empty', () => {
    expect(
      validateRegister('John', '', '123456')
    ).toBe('Email is required')
  })

  it('fails when password is empty', () => {
    expect(
      validateRegister('John', 'a@b.com', '')
    ).toBe('Password is required')
  })

  it('fails when password is too short', () => {
    expect(
      validateRegister('John', 'a@b.com', '123')
    ).toBe('Password must be at least 6 characters')
  })

  it('passes when all inputs are valid', () => {
    expect(
      validateRegister('John', 'a@b.com', '123456')
    ).toBeNull()
  })
})
