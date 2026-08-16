import { describe, expect, it } from 'vitest';
import { stories } from './stories';

describe('story catalogue', () => {
  it('keeps routes unique and retains the published stories', () => {
    const routes = stories.map((story) => `${story.category}/${story.slug}`);
    expect(new Set(routes).size).toBe(routes.length);
    expect(stories.filter((story) => story.status === 'published')).toHaveLength(4);
  });

  it('documents all Future themes as source-directed placeholders', () => {
    const futureStories = stories.filter((story) => story.category === 'future');

    expect(futureStories).toHaveLength(11);
    expect(futureStories.every((story) => story.status === 'coming-soon')).toBe(true);
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

  it('defines the comparison behind each published story', () => {
    for (const story of stories.filter((candidate) => candidate.status === 'published')) {
      expect(story.comparison?.title).toBeTruthy();
      expect(story.comparison?.fields.length).toBeGreaterThan(0);
      expect(story.comparison?.fields.every((field) => field.label && field.value)).toBe(true);
    }
  });
});
