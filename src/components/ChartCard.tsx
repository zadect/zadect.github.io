import { VegaEmbed } from 'react-vega';
import type { TopLevelSpec } from 'vega-lite';
import type { SourceReference } from '../content/sources';

interface ChartRow {
  [key: string]: number | string;
}

interface ChartCardProps {
  eyebrow: string;
  title: string;
  description: string;
  spec: TopLevelSpec;
  data: ChartRow[];
  columns: Array<{ key: string; label: string }>;
  sources: SourceReference[];
}

export function ChartCard({
  eyebrow,
  title,
  description,
  spec,
  data,
  columns,
  sources,
}: ChartCardProps) {
  const chartId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <article className="chart-card" aria-labelledby={`${chartId}-title`}>
      <div className="chart-card__header">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${chartId}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="chart-card__visual" aria-label={`${title} chart`}>
        <VegaEmbed
          spec={{ ...spec, data: { values: data } }}
          options={{ actions: false, renderer: 'svg' }}
        />
      </div>
      <details className="data-table">
        <summary>View the data table</summary>
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
                <tr key={`${chartId}-${rowIndex}`}>
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
            {source.publisher}
          </a>
        ))}
      </div>
    </article>
  );
}
