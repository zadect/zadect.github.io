import { HashRouter, Link, Route, Routes, useParams } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { StoryCard } from '../components/StoryCard';
import { ComingSoonStory } from '../features/stories/ComingSoonStory';
import { CeoPayStory } from '../features/stories/CeoPayStory';
import { HungerStory } from '../features/stories/HungerStory';
import {
  getStory,
  getStoriesByCategory,
  type StoryCategory,
  type StoryDefinition,
} from '../content/stories';

function HomePage() {
  const goodStories = getStoriesByCategory('good');
  const badStories = getStoriesByCategory('bad');
  const goodFeature = goodStories[0];
  const badFeature = badStories.find((story) => story.status === 'published') ?? badStories[0];

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
              A calm look at the lines moving in the right direction, the lines moving in the wrong
              one, and the space between them.
            </p>
            <div className="home-hero__actions">
              <a className="button button--good" href="#stories">
                Explore the stories
              </a>
              <span className="home-hero__aside">Good news. Hard truths. Same timeline.</span>
            </div>
          </div>
          <div className="direction-map" aria-label="Two diverging lines represent good and bad trends">
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
            Progress is not a verdict. It is a collection of lines, moving at different speeds.
          </h2>
          <p>
            We use charts because a single headline cannot hold the whole picture. Every story
            keeps its units visible, names its limits, and points back to the source.
          </p>
        </section>

        <section className="featured-section" id="stories" aria-labelledby="featured-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 id="featured-title">Two stories. One fragmented picture.</h2>
            </div>
            <p>Both are live now. The rest are documented and waiting for the right evidence.</p>
          </div>
          <div className="featured-grid">
            <StoryCard story={goodFeature} featured />
            <StoryCard story={badFeature} featured />
          </div>
        </section>

        <StoryIndex category="good" stories={goodStories} />
        <StoryIndex category="bad" stories={badStories} />
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
          <p>Progress is real. So are the contradictions.</p>
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
  return (
    <section className={`story-index story-index--${category}`} aria-labelledby={`${category}-title`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{category === 'good' ? 'The good' : 'The bad'}</p>
          <h2 id={`${category}-title`}>
            {category === 'good' ? 'Signals of human progress' : 'Signals we cannot look away from'}
          </h2>
        </div>
        <p>
          {category === 'good'
            ? 'Not a victory lap. A record of what has improved, and where the work remains.'
            : 'Not a prophecy. A record of pressure, concentration, and consequences.'}
        </p>
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
