import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getStoryCategoryPresentation, type StoryDefinition } from '../content/stories';
import { SiteHeader } from './SiteHeader';

interface StoryFrameProps {
  story: StoryDefinition;
  children: ReactNode;
}

export function StoryFrame({ story, children }: StoryFrameProps) {
  const category = getStoryCategoryPresentation(story.category);

  return (
    <div className={`site-shell site-shell--${story.category}`}>
      <SiteHeader />
      <main>
        <div className="story-container">
          <Link className="back-link" to="/">
            ← Back to the overview
          </Link>
          <header className="story-hero">
            <p className="eyebrow">{category.signalLabel}</p>
            <h1>{story.title}</h1>
            <p className="story-hero__summary">{story.summary}</p>
          </header>
          {children}
        </div>
      </main>
      <footer className="site-footer">
        <div className="story-container">
          <Link className="brand brand--footer" to="/">
            <span className="brand__mark" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="brand__text">
              <span>The Good</span>
              <span>&amp; The Bad</span>
            </span>
          </Link>
          <p>The evidence is mixed. The sources are visible.</p>
        </div>
      </footer>
    </div>
  );
}
