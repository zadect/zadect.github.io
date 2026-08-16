import { describe, expect, it } from 'vitest';
import { getStoriesByCategory, stories } from './stories';

describe('story catalogue', () => {
  it('keeps routes unique and retains the published stories', () => {
    const routes = stories.map((story) => `${story.category}/${story.slug}`);
    expect(new Set(routes).size).toBe(routes.length);
    expect(stories.filter((story) => story.status === 'published')).toHaveLength(22);
  });

  it('documents the remaining Future themes as source-directed placeholders', () => {
    const futureStories = stories.filter((story) => story.category === 'future');

    expect(futureStories).toHaveLength(11);
    expect(futureStories.filter((story) => story.status === 'coming-soon')).toHaveLength(5);
    expect(
      futureStories.every(
        (story) => story.plannedMetric && story.geography && story.sourceHint,
      ),
    ).toBe(true);
  });

  it('keeps every deferred story documented with a planned metric', () => {
    expect(
      stories
        .filter((story) => story.status === 'coming-soon')
        .every((story) => story.plannedMetric && story.sourceHint),
    ).toBe(true);
  });

  it('puts published stories first while preserving catalogue order within each status', () => {
    expect(getStoriesByCategory('future').map((story) => story.slug).slice(0, 2)).toEqual([
        'tech-and-ai',
        'employment-work-and-skills',
    ]);
    expect(
        getStoriesByCategory('future').findIndex((story) => story.status === 'coming-soon'),
    ).toBe(6);
  });

  it('defines the comparison behind each published story', () => {
    for (const story of stories.filter((candidate) => candidate.status === 'published')) {
      expect(story.comparison?.title).toBeTruthy();
      expect(story.comparison?.fields.length).toBeGreaterThan(0);
      expect(story.comparison?.fields.every((field) => field.label && field.value)).toBe(true);
    }
  });

  it('documents the child mortality comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'child-mortality');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Long run',
      'Panel',
      'Limit',
    ]);
  });

  it('documents the life expectancy comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'life-expectancy');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Long run',
      'Panel',
      'Limit',
    ]);
  });

  it('documents the vaccination coverage comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'vaccination-coverage');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Long run',
      'Panel',
      'Limit',
    ]);
  });

  it('documents the electricity and sanitation comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'electricity-and-sanitation');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Electricity',
      'Sanitation',
      'Scope',
      'Limit',
    ]);
  });

  it('documents the extreme poverty comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'extreme-poverty');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'World',
      'Countries',
      'Limit',
    ]);
  });

  it('documents the climate change comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'climate-change');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Baseline',
      'Scope',
      'Limit',
    ]);
  });

  it('documents the wars and conflict comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'wars-and-conflict');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Deaths',
      'Conflicts',
      'Coverage',
      'Limit',
    ]);
  });

  it('documents the rich and poor comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'inequality-by-country');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Panel',
      'Welfare data',
      'Limit',
    ]);
  });

  it('documents the biodiversity loss comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'biodiversity-loss');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Scope',
      'Uncertainty',
      'Limit',
    ]);
  });

  it('documents the forced-displacement comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'forced-displacement');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Long run',
      'Scope',
      'Limit',
    ]);
  });

  it('documents the air-pollution comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'air-pollution');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Panel',
      'Reference',
      'Limit',
    ]);
  });

  it('documents the employment and skills comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'employment-work-and-skills');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'World',
      'Panel',
      'Limit',
    ]);
  });

  it('documents the wealth distribution comparison and source scope', () => {
    const story = stories.find(
      (candidate) => candidate.slug === 'wealth-distribution-and-inequality',
    );
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Measure',
      'Long run',
      'Panel',
      'Limit',
    ]);
  });

  it('documents the economic growth and debt comparison and source scope', () => {
    const story = stories.find(
      (candidate) => candidate.slug === 'economic-growth-debt-and-public-finance',
    );
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Growth',
      'Debt',
      'Scope',
      'Limit',
    ]);
  });

  it('documents the inflation and energy comparison and source scope', () => {
    const story = stories.find((candidate) => candidate.slug === 'inflation-prices-and-energy');
    expect(story?.status).toBe('published');
    expect(story?.comparison?.fields.map((field) => field.label)).toEqual([
      'Prices',
      'Energy',
      'Coverage',
      'Limit',
    ]);
  });
});
