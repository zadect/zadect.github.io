import { VegaEmbed } from 'react-vega';
import type { TopLevelSpec } from 'vega-lite';
import type { SourceReference } from '../content/sources';

interface MapRow {
  [key: string]: number | string | undefined;
}

interface MapCardProps {
  eyebrow: string;
  title: string;
  description: string;
  definition?: string;
  spec: TopLevelSpec;
  data: MapRow[];
  columns: Array<{ key: string; label: string }>;
  sources: SourceReference[];
  tone?: 'good' | 'bad';
  noDataLabel?: string;
  coverageNote?: string;
}

export function MapCard({
  eyebrow,
  title,
  description,
  definition,
  spec,
  data,
  columns,
  sources,
  tone = 'good',
  noDataLabel = 'Grey indicates no data in the map extract.',
  coverageNote,
}: MapCardProps) {
  const mapId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <article
      className={`chart-card chart-card--${tone} map-card`}
      data-chart-tone={tone}
      aria-labelledby={`${mapId}-title`}
    >
      <div className="chart-card__header">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${mapId}-title`}>{title}</h2>
        <p>{description}</p>
        {definition ? (
          <p className="chart-card__definition">
            <strong>Measure:</strong> {definition}
          </p>
        ) : null}
      </div>
      <div className="chart-card__visual map-card__visual" aria-label={`${title} map`}>
        <VegaEmbed spec={spec} options={{ actions: false, renderer: 'svg' }} />
      </div>
      <p className="map-card__legend-note">
        <span aria-hidden="true" />
        {noDataLabel}
      </p>
      {coverageNote ? <p className="map-card__coverage-note">{coverageNote}</p> : null}
      <details className="data-table">
        <summary>View the map data</summary>
        <div className="data-table__scroll">
          <table>
            <caption className="sr-only">{title} data</caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={`${mapId}-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column.key}>{row[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <div className="chart-card__sources">
        <span>Sources</span>
        {sources.map((source) => (
          <a key={source.id} href={source.dataHref} target="_blank" rel="noreferrer">
            {source.title}
          </a>
        ))}
      </div>
    </article>
  );
}
