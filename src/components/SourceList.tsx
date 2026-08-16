import type { SourceReference } from '../content/sources';

interface SourceListProps {
  sources: SourceReference[];
}

export function SourceList({ sources }: SourceListProps) {
  return (
    <div className="source-list">
      {sources.map((source) => (
        <article className="source-item" key={source.id}>
          <div>
            <p className="source-item__title">{source.title}</p>
            <p className="source-item__publisher">{source.publisher}</p>
          </div>
          <p className="source-item__note">{source.note}</p>
          <div className="source-item__links">
            <a href={source.href} target="_blank" rel="noreferrer">
              Methodology
            </a>
            <a href={source.dataHref} target="_blank" rel="noreferrer">
              Data source
            </a>
          </div>
          <p className="source-item__coverage">
            {source.coverage} · Retrieved {source.retrieved}
          </p>
        </article>
      ))}
    </div>
  );
}
