/* global console, process */

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

function sourcePaths() {
  return new Set([...sourceText.matchAll(/src\/data\/[A-Za-z0-9._-]+/g)].map((match) => match[0]));
}

function inspectFile(relativePath) {
  const bytes = fs.readFileSync(path.join(repositoryRoot, relativePath));
  const checksum = crypto.createHash('sha256').update(bytes).digest('hex');
  if (path.extname(relativePath) === '.json') {
    return { checksum, rowCount: null, dataFrom: null, dataThrough: null };
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
    checksum,
    rowCount: Math.max(0, rows.length - 1),
    dataFrom: years.length ? Math.min(...years) : null,
    dataThrough: years.length ? Math.max(...years) : null,
  };
}

const errors = [];
for (const relativePath of sourcePaths()) {
  const manifestPath = path.join(
    provenanceDirectory,
    `${path.basename(relativePath).replace(/\.[^.]+$/, '')}.json`,
  );
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${relativePath}: missing provenance manifest`);
    continue;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const actual = inspectFile(relativePath);
  for (const [field, expected] of Object.entries({
    path: relativePath,
    rawFileSha256: actual.checksum,
    rowCount: actual.rowCount,
    dataFrom: actual.dataFrom,
    dataThrough: actual.dataThrough,
  })) {
    if (manifest[field] !== expected) {
      errors.push(`${relativePath}: ${field} does not match the committed extract`);
    }
  }

  for (const field of ['sourceIds', 'sourceUrls', 'publishers', 'retrieved', 'upstreamVersions']) {
    if (!Array.isArray(manifest[field]) || manifest[field].length === 0) {
      errors.push(`${relativePath}: ${field} must contain source metadata`);
    }
  }
  if (!manifest.transformation || !Array.isArray(manifest.retainedFilters)) {
    errors.push(`${relativePath}: transformation and retainedFilters are required`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified provenance for ${sourcePaths().size} local data files.`);
}
