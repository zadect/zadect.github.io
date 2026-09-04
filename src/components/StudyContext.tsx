import type { SourceReference } from '../content/sources';

export interface StudyContextItem {
  title: string;
  authorYear: string;
  purpose: string;
  method: string;
  limit: string;
  source: SourceReference;
}

interface StudyContextProps {
  items: StudyContextItem[];
}

export function StudyContext({ items }: StudyContextProps) {
  return (
    <section className="study-context" aria-labelledby="study-context-title">
      <p className="eyebrow">Related research</p>
      <h2 id="study-context-title">Studies that address the wider question.</h2>
      <p className="study-context__intro">
        These publications cover questions beyond the plotted measures. Their estimates and
        scenarios are separate from the charts above.
      </p>
      <div className="study-grid">
        {items.map((item) => (
          <article className="study-card" key={item.source.id}>
            <p className="study-card__meta">{item.authorYear}</p>
            <h3>{item.title}</h3>
            <p>
              <strong>Purpose:</strong> {item.purpose}
            </p>
            <p>
              <strong>Method and scope:</strong> {item.method}
            </p>
            <p>
              <strong>Limit here:</strong> {item.limit}
            </p>
            <a href={item.source.dataHref} target="_blank" rel="noreferrer">
              Read the primary publication
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
