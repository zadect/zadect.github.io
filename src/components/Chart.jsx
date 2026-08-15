import React from 'react'
import { VegaLite } from 'react-vega'

// Chart renders a Vega-Lite time-series line chart for a CSV data file.
// dataFile: relative path to CSV with columns: year, value, [series]
export default function Chart({ id, dataFile }){
  const spec = {
    width: 'container',
    height: 320,
    data: { url: dataFile, format: { type: 'csv' } },
    mark: { type: 'line', point: true, tooltip: true },
    encoding: {
      x: { field: 'year', type: 'temporal', title: 'Year', axis: { format: '%Y' } },
      y: { field: 'value', type: 'quantitative', title: 'Value' }
    }
  }

  return (
    <div className="chart" role="img" aria-label={`Chart for ${id}`}>
      <VegaLite spec={spec} />
      <p className="chart-note">Data: <code>{dataFile}</code></p>
    </div>
  )
}
