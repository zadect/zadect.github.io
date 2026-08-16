import { VegaEmbed } from 'react-vega';
import type { TopLevelSpec } from 'vega-lite';
import type { SourceReference } from '../content/sources';

interface ChartRow {
  [key: string]: number | string | undefined;
}

export type ChartTone = 'good' | 'bad' | 'future';

interface ChartCardProps {
  eyebrow: string;
  title: string;
  description: string;
  spec: TopLevelSpec;
  data: ChartRow[];
  columns: Array<{ key: string; label: string }>;
  sources: SourceReference[];
  tone?: ChartTone;
  definition?: string;
}

export function ChartCard({
  eyebrow,
  title,
  description,
  spec,
  data,
  columns,
  sources,
  tone = 'good',
  definition,
}: ChartCardProps) {
  const chartId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const chartBackground =
    tone === 'bad' ? '#313535' : tone === 'future' ? '#f7f4fa' : '#f8f6ef';
  const defaultAxis =
    tone === 'bad'
      ? {
          labelColor: '#e8e3dc',
          titleColor: '#fffaf3',
          domainColor: '#a7aaa6',
          tickColor: '#a7aaa6',
          gridColor: '#555b59',
        }
      : tone === 'future'
        ? {
            labelColor: '#5f5870',
            titleColor: '#3e3459',
            domainColor: '#aaa0bd',
            tickColor: '#aaa0bd',
            gridColor: '#ddd5e8',
          }
      : {
          labelColor: '#5b635f',
          titleColor: '#35403d',
          domainColor: '#9fa8a1',
          tickColor: '#9fa8a1',
          gridColor: '#d8ded8',
        };
  const sourceConfig =
    typeof spec.config === 'object' && spec.config !== null ? spec.config : undefined;
  const hasSourceLegend = sourceConfig !== undefined && 'legend' in sourceConfig;
  const sourceLegend = hasSourceLegend ? sourceConfig.legend : undefined;
  const chartSpec: TopLevelSpec = {
    ...spec,
    background: chartBackground,
    config: {
      ...(spec.config ?? {}),
      background: chartBackground,
      axis: {
        ...defaultAxis,
        ...(typeof spec.config === 'object' && spec.config !== null && 'axis' in spec.config
          ? spec.config.axis
          : {}),
      },
      ...(tone === 'bad'
        ? {
            legend: {
              labelColor: '#e8e3dc',
              titleColor: '#fffaf3',
              symbolStrokeColor: '#e8e3dc',
              ...(sourceLegend ?? {}),
            },
          }
        : tone === 'future'
          ? {
              legend: {
                labelColor: '#5f5870',
                titleColor: '#3e3459',
                symbolStrokeColor: '#6b5a98',
                ...(sourceLegend ?? {}),
              },
            }
        : hasSourceLegend
          ? { legend: sourceLegend }
          : {}),
      view: {
        stroke: tone === 'bad' ? '#6a706d' : tone === 'future' ? '#d7cee4' : '#d6d8ce',
        fill: chartBackground,
        ...(typeof spec.config === 'object' && spec.config !== null && 'view' in spec.config
          ? spec.config.view
          : {}),
      },
    },
  };

  return (
    <article
      className={`chart-card chart-card--${tone}`}
      data-chart-tone={tone}
      aria-labelledby={`${chartId}-title`}
    >
      <div className="chart-card__header">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${chartId}-title`}>{title}</h2>
        <p>{description}</p>
        {definition ? (
          <p className="chart-card__definition">
            <strong>Measure:</strong> {definition}
          </p>
        ) : null}
      </div>
      <div className="chart-card__visual" aria-label={`${title} chart`}>
        <VegaEmbed
          spec={{ ...chartSpec, data: { values: data } }}
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
            {source.title}
          </a>
        ))}
      </div>
    </article>
  );
}
