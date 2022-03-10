import React from 'react'
import { render, screen } from '@testing-library/react'

import { Loading } from '../components/Loading'
import { SendMessagesButton } from '../components/SendMessagesButton'
import { SignInButton } from '../components/SignInButton'
import { SignOutButton } from '../components/SignOutButton'

describe('Loading component', () => {
  it('Render correctly', () => {
    const { container } = render(<Loading />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('the title is visible', () => {
    render(<Loading />)
    expect(screen.getByText(/Loading\.\.\./i)).toBeTruthy()
  })
})

describe('SendMessagesButton component', () => {
  it('Render correctly', () => {
    const { container } = render(<SendMessagesButton sendMessages={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('the title is visible', () => {
    render(<SendMessagesButton sendMessages={() => {}} />)
    expect(screen.getByText(/Send Messages/i)).toBeTruthy()
  })
})

describe('SignInButton component', () => {
  it('Render correctly', () => {
    const { container } = render(<SignInButton />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('the title is visible', () => {
    render(<SignInButton />)
    expect(screen.getByText(/Sign In With Google/i)).toBeTruthy()
  })
})

describe('SignOutButton component', () => {
  it('Render correctly', () => {
    const { container } = render(<SignOutButton />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('the title is visible', () => {
    render(<SignOutButton />)
    expect(screen.getByText(/Sign Out/i)).toBeTruthy()
  })
})
