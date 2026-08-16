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
          <p className="source-item__citation">
            <strong>Citation:</strong> {source.citation}
          </p>
          <p className="source-item__roles">
            <strong>Original data:</strong> {source.originalPublisher}
            {source.processor ? (
              <>
                <br />
                <strong>Processing:</strong> {source.processor}
              </>
            ) : null}
          </p>
          <p className="source-item__note">{source.note}</p>
          <div className="source-item__links">
            <a href={source.methodologyHref} target="_blank" rel="noreferrer">
              Methodology
            </a>
            <a href={source.dataHref} target="_blank" rel="noreferrer">
              Data / published table
            </a>
            {source.originalDataHref ? (
              <a href={source.originalDataHref} target="_blank" rel="noreferrer">
                Original data
              </a>
            ) : null}
            {source.metadataHref ? (
              <a href={source.metadataHref} target="_blank" rel="noreferrer">
                Metadata
              </a>
            ) : null}
          </div>
          <p className="source-item__coverage">
            {source.coverage} · Unit: {source.unit} · Accessed {source.retrieved}
            {source.localPath ? ` · Local extract: ${source.localPath}` : ''}
            <br />
            <strong>Version:</strong> {source.version}
            <br />
            <strong>Transformation:</strong> {source.transformation}
          </p>
        </article>
      ))}
    </div>
  );
}
