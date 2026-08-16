import { Link } from 'react-router-dom';
import { getStoryCategoryPresentation, type StoryDefinition } from '../../content/stories';
import { SiteHeader } from '../../components/SiteHeader';

interface ComingSoonStoryProps {
  story: StoryDefinition;
}

export function ComingSoonStory({ story }: ComingSoonStoryProps) {
  const category = getStoryCategoryPresentation(story.category);

  return (
    <div className={`site-shell site-shell--${story.category}`}>
      <SiteHeader />
      <main>
        <div className="story-container">
          <Link className="back-link" to="/">
            ← Back to the overview
          </Link>
          <section className="coming-soon">
            <p className="eyebrow">{category.signalLabel}</p>
            <p className="coming-soon__label">Coming next</p>
            <h1>{story.title}</h1>
            <p className="lede">{story.summary}</p>
            <dl className="coming-soon__details">
              <div>
                <dt>Planned measure</dt>
                <dd>{story.plannedMetric}</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>{story.geography}</dd>
              </div>
              <div>
                <dt>Likely sources</dt>
                <dd>{story.sourceHint}</dd>
              </div>
            </dl>
            <p className="coming-soon__note">
              This story is documented in the catalogue, but it has no chart or trend claim yet.
              It will be added only when a comparable, well-sourced series is ready.
            </p>
            <Link className="button button--outline" to="/">
              Explore the published stories
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
