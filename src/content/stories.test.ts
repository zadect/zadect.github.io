import { describe, expect, it } from 'vitest';
import { stories } from './stories';

describe('story catalogue', () => {
  it('keeps routes unique and contains exactly two published stories', () => {
    const routes = stories.map((story) => `${story.category}/${story.slug}`);
    expect(new Set(routes).size).toBe(routes.length);
    expect(stories.filter((story) => story.status === 'published')).toHaveLength(2);
  });

  it('keeps every deferred story documented with a planned metric', () => {
    expect(
      stories
        .filter((story) => story.status === 'coming-soon')
        .every((story) => story.plannedMetric && story.sourceHint),
    ).toBe(true);
  });
});
