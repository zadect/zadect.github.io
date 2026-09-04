/* global console */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const dataDirectory = path.join(repositoryRoot, 'src', 'data');
const provenanceDirectory = path.join(dataDirectory, 'provenance');
const sourceText = fs.readFileSync(
  path.join(repositoryRoot, 'src', 'content', 'sources.ts'),
  'utf8',
);

function fieldValue(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*(?:\\n\\s*)?'([^']*)'`));
  return match?.[1];
}

function parseSourceBlocks() {
  const sourceMap = new Map();
  const blocks = sourceText.matchAll(/\{\n\s{4}id: '([^']+)',([\s\S]*?)\n\s{2}\},/g);

  for (const match of blocks) {
    const block = match[0];
    const source = {
      id: match[1],
      dataHref: fieldValue(block, 'dataHref'),
      publisher: fieldValue(block, 'publisher'),
      version: fieldValue(block, 'version'),
      retrieved: fieldValue(block, 'retrieved') ?? '2026-08-16',
      transformation: fieldValue(block, 'transformation') ?? '',
      coverage: fieldValue(block, 'coverage') ?? '',
    };
    const localPaths = [...block.matchAll(/src\/data\/[A-Za-z0-9._-]+/g)].map(
      (pathMatch) => pathMatch[0],
    );

    for (const localPath of localPaths) {
      const existing = sourceMap.get(localPath) ?? [];
      existing.push(source);
      sourceMap.set(localPath, existing);
    }
  }

  return sourceMap;
}

function inspectDataFile(relativePath) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  const bytes = fs.readFileSync(absolutePath);
  const checksum = crypto.createHash('sha256').update(bytes).digest('hex');
  const extension = path.extname(relativePath);

  if (extension === '.json') {
    return {
      format: 'json',
      columns: [],
      rowCount: null,
      dataFrom: null,
      dataThrough: null,
      rawFileSha256: checksum,
      checksumScope: 'committed local extract',
    };
  }

  const rows = bytes
    .toString('utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const columns = rows[0]?.split(',') ?? [];
  const yearIndex = columns.findIndex((column) => column.toLowerCase() === 'year');
  const years =
    yearIndex < 0
      ? []
      : rows
          .slice(1)
          .map((row) => Number(row.split(',')[yearIndex]))
          .filter(Number.isFinite);

  return {
    format: 'csv',
    columns,
    rowCount: Math.max(0, rows.length - 1),
    dataFrom: years.length ? Math.min(...years) : null,
    dataThrough: years.length ? Math.max(...years) : null,
    rawFileSha256: checksum,
    checksumScope: 'committed local extract',
  };
}

function buildManifest(relativePath, sourcesForPath) {
  const inspection = inspectDataFile(relativePath);
  const transformations = [...new Set(sourcesForPath.map((source) => source.transformation))];
  const filters = [...new Set(sourcesForPath.map((source) => source.coverage).filter(Boolean))];

  return {
    path: relativePath,
    sourceIds: sourcesForPath.map((source) => source.id),
    sourceUrls: [...new Set(sourcesForPath.map((source) => source.dataHref).filter(Boolean))],
    publishers: [...new Set(sourcesForPath.map((source) => source.publisher).filter(Boolean))],
    retrieved: [...new Set(sourcesForPath.map((source) => source.retrieved))],
    upstreamVersions: [...new Set(sourcesForPath.map((source) => source.version).filter(Boolean))],
    rawFileSha256: inspection.rawFileSha256,
    checksumScope: inspection.checksumScope,
    format: inspection.format,
    columns: inspection.columns,
    rowCount: inspection.rowCount,
    dataFrom: inspection.dataFrom,
    dataThrough: inspection.dataThrough,
    retainedFilters: filters,
    derivedFields: [],
    transformation: transformations.join(' '),
  };
}

const sourceMap = parseSourceBlocks();
fs.mkdirSync(provenanceDirectory, { recursive: true });

for (const [relativePath, sourcesForPath] of sourceMap) {
  const fileName = `${path.basename(relativePath).replace(/\.[^.]+$/, '')}.json`;
  const manifest = buildManifest(relativePath, sourcesForPath);
  fs.writeFileSync(
    path.join(provenanceDirectory, fileName),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

console.log(`Wrote ${sourceMap.size} data provenance manifests.`);
