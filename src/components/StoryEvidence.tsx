import { createContext, useContext } from 'react';
import type { StoryDefinition, StoryEvidence as StoryEvidenceMetadata } from '../content/stories';

export const StoryEvidenceContext = createContext<StoryEvidenceMetadata | null>(null);

const evidenceStatusLabels: Record<StoryEvidenceMetadata['status'], string> = {
  'historical-observation': 'Historical observation',
  'historical-estimate': 'Historical estimate',
  'modelled-estimate': 'Modelled estimate',
  'source-extrapolation': 'Source extrapolation',
  'source-projection': 'Source projection',
};

export function getEvidenceStatusLabel(status: StoryEvidenceMetadata['status']) {
  return evidenceStatusLabels[status];
}

export function useStoryEvidence() {
  return useContext(StoryEvidenceContext);
}

interface EvidenceStripProps {
  story: StoryDefinition;
}

export function EvidenceStrip({ story }: EvidenceStripProps) {
  const { evidence } = story;

  return (
    <section className="evidence-strip" aria-label="Evidence scope">
      <div className="evidence-strip__item">
        <span>Metric</span>
        <strong>{story.plannedMetric}</strong>
      </div>
      <div className="evidence-strip__item">
        <span>Geography</span>
        <strong>{story.geography}</strong>
      </div>
      <div className="evidence-strip__item">
        <span>Evidence</span>
        <strong data-evidence-status={evidence.status}>
          {getEvidenceStatusLabel(evidence.status)}
        </strong>
      </div>
      <div className="evidence-strip__item">
        <span>Data through</span>
        <strong>{evidence.dataThrough}</strong>
      </div>
      <p className="evidence-strip__note">{evidence.note}</p>
      <a className="evidence-strip__link" href="#sources-and-methodology">
        Definitions and methodology
      </a>
    </section>
  );
}
