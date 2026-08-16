import { Link } from 'react-router-dom';
import type { StoryDefinition } from '../content/stories';

interface StoryCardProps {
  story: StoryDefinition;
  featured?: boolean;
}

export function StoryCard({ story, featured = false }: StoryCardProps) {
  return (
    <Link
      className={`story-card story-card--${story.category}${featured ? ' story-card--featured' : ''}`}
      to={`/${story.category}/${story.slug}`}
    >
      <span className="story-card__meta">
        {story.category === 'good' ? 'Good signal' : 'Bad signal'}
        {story.status === 'coming-soon' ? ' · Coming next' : ''}
      </span>
      <span className="story-card__title">{story.title}</span>
      <span className="story-card__summary">{story.summary}</span>
      <span className="story-card__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
