import { Link } from 'react-router-dom';
import { getStoryCategoryPresentation, type StoryDefinition } from '../content/stories';

interface StoryCardProps {
  story: StoryDefinition;
}

export function StoryCard({ story }: StoryCardProps) {
  const category = getStoryCategoryPresentation(story.category);

  return (
    <Link
      className={`story-card story-card--${story.category}`}
      to={`/${story.category}/${story.slug}`}
    >
      <span className="story-card__header">
        <span className="story-card__meta">
          {story.status === 'coming-soon'
            ? `${category.label} · Coming next`
            : `${category.label} · ${story.evidence.cardLabel}`}
        </span>
        <span className="story-card__arrow" aria-hidden="true">
          →
        </span>
      </span>
      <span className="story-card__title">{story.title}</span>
      <span className="story-card__scope">
        {story.plannedMetric} · {story.geography} · Through {story.evidence.dataThrough}
      </span>
      <span className="story-card__summary">{story.summary}</span>
    </Link>
  );
}
