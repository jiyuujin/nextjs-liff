import React from 'react'
import { render, screen } from '@testing-library/react'

import { SendMessagesButton } from '../src/components/SendMessagesButton'

describe('SendMessagesButton component', () => {
  it('Render correctly', () => {
    const { container } = render(<SendMessagesButton sendMessages={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('the title is visible', () => {
    render(<SendMessagesButton sendMessages={() => {}} />)
    expect(screen.queryAllByText(/Send Messages/i)).toBeTruthy()
  })
})
