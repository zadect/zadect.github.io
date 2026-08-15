import React from 'react'

// Placeholder Chart component. Intended to wrap a Vega-Lite or Chart.js implementation.
// For initial scaffold it renders a placeholder area. Replace with an implementation
// that reads `dataFile` and renders time-series with proper axes and legend.
export default function Chart({ id, dataFile }){
  return (
    <div className="chart-placeholder" role="img" aria-label={`Chart for ${id}`}>
      <div className="chart-area">Chart: {id}</div>
      <p className="chart-note">Data source: {dataFile}</p>
    </div>
  )
}
