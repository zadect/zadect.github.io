import { describe, expect, it } from 'vitest';
import { getStoriesByCategory, stories } from './stories';

describe('story catalogue', () => {
  it('keeps routes unique and retains the published stories', () => {
    const routes = stories.map((story) => `${story.category}/${story.slug}`);
    expect(new Set(routes).size).toBe(routes.length);
    expect(stories.filter((story) => story.status === 'published')).toHaveLength(10);
  });

  it('documents the remaining Future themes as source-directed placeholders', () => {
    const futureStories = stories.filter((story) => story.category === 'future');

    expect(futureStories).toHaveLength(11);
    expect(futureStories.filter((story) => story.status === 'coming-soon')).toHaveLength(9);
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
        'housing-cities-and-infrastructure',
    ]);
    expect(
        getStoriesByCategory('future').findIndex((story) => story.status === 'coming-soon'),
    ).toBe(2);
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
});
