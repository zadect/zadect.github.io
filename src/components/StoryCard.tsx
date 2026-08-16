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
      <span className="story-card__meta">
        {category.signalLabel}
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
