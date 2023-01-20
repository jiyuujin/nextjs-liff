import React from 'react'
import { render, screen } from '@testing-library/react'

import { Loading } from '../components/Loading'
import { SendMessagesButton } from '../components/SendMessagesButton'

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
