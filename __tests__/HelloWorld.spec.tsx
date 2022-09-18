import React from 'react'
import { render, screen } from '@testing-library/react'

import HelloWorld from '../components/HelloWorld'

describe('HelloWorld component', () => {
  it('Render correctly', () => {
    const { container } = render(<HelloWorld msg={'Hello World'} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('the title is visible', () => {
    render(<HelloWorld msg={'Hello World'} />)
    expect(screen.queryAllByText(/Hello World/i)).toBeTruthy()
  })
})
