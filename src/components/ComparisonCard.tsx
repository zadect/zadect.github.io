interface ComparisonCardProps {
  title: string;
  fields: Array<{ label: string; value: string }>;
  tone?: 'good' | 'bad' | 'future';
}

export function ComparisonCard({ title, fields, tone = 'good' }: ComparisonCardProps) {
  const titleId = `comparison-card-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const toneClass = tone === 'bad' ? ' definition-card--dark' : tone === 'future' ? ' definition-card--future' : '';

  return (
    <section
      className={`definition-card${toneClass}`}
      aria-labelledby={titleId}
    >
      <p className="eyebrow">What this compares</p>
      <h2 id={titleId}>{title}</h2>
      <dl className="definition-grid">
        {fields.map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
