import React from 'react'
import { render, screen } from '@testing-library/react'
import Chart from '../components/Chart'

describe('Chart component', () => {
  it('renders and includes aria label', () => {
    render(<Chart id="world-hunger" dataFile="/data/world-hunger.csv" />)
    const el = screen.getByRole('img', { name: /Chart for world-hunger/i })
    expect(el).toBeInTheDocument()
  })
})
