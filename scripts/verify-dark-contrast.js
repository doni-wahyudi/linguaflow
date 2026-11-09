import fs from 'node:fs';

const css = fs.readFileSync('src/styles/index.css', 'utf-8');
const darkSectionMatch = css.match(/\[data-theme=['"]dark['"]\]\s*\{([^}]+)\}/);

if (!darkSectionMatch) {
  console.error('FAIL: [data-theme="dark"] section not found in index.css');
  process.exit(1);
}

const darkProps = darkSectionMatch[1];
const requiredTokens = [
  '--success-bg',
  '--success-border',
  '--success-strong',
  '--error-bg',
  '--error-border',
  '--error-strong',
  '--warning-bg',
  '--warning-border',
  '--warning-strong',
  '--info-bg',
  '--info-border',
  '--info-strong',
  '--surface-card',
  '--ink-200',
  '--ink-500',
];

const missing = requiredTokens.filter((token) => !darkProps.includes(token));

if (missing.length > 0) {
  console.error(`FAIL: Missing required dark mode tokens: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('PASS: All required dark mode contrast tokens defined.');
process.exit(0);
