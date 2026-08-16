import { useEffect } from 'react';
import { HashRouter, Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { StoryCard } from '../components/StoryCard';
import { AiTechStory } from '../features/stories/AiTechStory';
import { ComingSoonStory } from '../features/stories/ComingSoonStory';
import { CeoPayStory } from '../features/stories/CeoPayStory';
import { DemocraticBackslidingStory } from '../features/stories/DemocraticBackslidingStory';
import { HungerStory } from '../features/stories/HungerStory';
import { HousingStory } from '../features/stories/HousingStory';
import { LiteracyStory } from '../features/stories/LiteracyStory';
import {
  getStory,
  getStoryCategoryPresentation,
  getStoriesByCategory,
  type StoryCategory,
  type StoryDefinition,
} from '../content/stories';

function HomePage() {
  const goodStories = getStoriesByCategory('good');
  const badStories = getStoriesByCategory('bad');
  const futureStories = getStoriesByCategory('future');
  const location = useLocation();

  useEffect(() => {
    const section = new URLSearchParams(location.search).get('section');
    if (section !== 'good' && section !== 'bad' && section !== 'future') return;

    requestAnimationFrame(() => {
      document.getElementById(`${section}-section`)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [location.search]);

  return (
    <div className="site-shell site-shell--home">
      <SiteHeader />
      <main>
        <section className="home-hero">
          <div className="home-hero__copy">
            <p className="eyebrow">An evidence-led atlas of change</p>
            <h1>
              Where is humanity
              <em> heading?</em>
            </h1>
            <p className="home-hero__intro">
              Charts that put improving conditions beside worsening ones, and track the forces
              likely to shape the years ahead.
            </p>
            <div className="home-hero__actions">
              <Link className="button button--good" to="/?section=good">
                Explore the stories
              </Link>
              <span className="home-hero__aside">Good trends. Bad trends. What comes next.</span>
            </div>
          </div>
          <div
            className="direction-map"
            aria-label="The green line rises from then to now. The red line falls from then to now."
          >
            <div className="direction-map__line direction-map__line--good">
              <span className="direction-map__label">GOOD</span>
            </div>
            <div className="direction-map__line direction-map__line--bad">
              <span className="direction-map__label">BAD</span>
            </div>
            <div className="direction-map__axis" aria-hidden="true">
              <span>then</span>
              <span>now</span>
            </div>
          </div>
        </section>

        <section className="home-thesis" aria-labelledby="thesis-title">
          <p className="eyebrow">The premise</p>
          <h2 id="thesis-title">
            Humanity is changing in more than one direction at once.
          </h2>
          <p>
            Charts make the contrast visible. They also show which questions need better evidence
            before the next chapter is written.
          </p>
        </section>

        <StoryIndex category="good" stories={goodStories} />
        <StoryIndex category="bad" stories={badStories} />
        <StoryIndex category="future" stories={futureStories} />
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

interface StoryIndexProps {
  category: StoryCategory;
  stories: StoryDefinition[];
}

function StoryIndex({ category, stories }: StoryIndexProps) {
  const presentation = getStoryCategoryPresentation(category);

  return (
    <section
      className={`story-index story-index--${category}`}
      id={`${category}-section`}
      aria-labelledby={`${category}-title`}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">{presentation.label}</p>
          <h2 id={`${category}-title`}>{presentation.heading}</h2>
        </div>
        <p>{presentation.description}</p>
      </div>
      <div className="story-list">
        {stories.map((story) => (
          <StoryCard key={story.slug} story={story} />
        ))}
      </div>
    </section>
  );
}

function StoryRoute() {
  const { category, slug } = useParams();
  const story = getStory(category, slug);

  if (!story) {
    return <NotFoundPage />;
  }

  if (story.status === 'coming-soon') {
    return <ComingSoonStory story={story} />;
  }

  if (story.slug === 'world-hunger') {
    return <HungerStory story={story} />;
  }

  if (story.slug === 'ceo-pay-gap') {
    return <CeoPayStory story={story} />;
  }

  if (story.slug === 'literacy') {
    return <LiteracyStory story={story} />;
  }

  if (story.slug === 'democratic-backsliding') {
    return <DemocraticBackslidingStory story={story} />;
  }

  if (story.slug === 'tech-and-ai') {
    return <AiTechStory story={story} />;
  }

  if (story.slug === 'housing-cities-and-infrastructure') {
    return <HousingStory story={story} />;
  }

  return <NotFoundPage />;
}

function NotFoundPage() {
  return (
    <div className="site-shell site-shell--home">
      <SiteHeader />
      <main>
        <section className="not-found">
          <p className="eyebrow">No line here yet</p>
          <h1>That story does not exist.</h1>
          <p>Try the overview for the published stories and the documented ideas still to come.</p>
          <Link className="button button--good" to="/">
            Back to the overview
          </Link>
        </section>
      </main>
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:category/:slug" element={<StoryRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}
