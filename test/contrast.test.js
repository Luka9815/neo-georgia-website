import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/assets/css/site.css', 'utf8');
const tokens = Object.fromEntries(
  [...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(([, key, value]) => [
    key,
    value,
  ])
);
function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((channel) => parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    );
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

// These are the allowed text/surface pairs, including all badge and footer variants.
for (const background of ['paper', 'surface', 'accent-soft', 'teal-soft']) {
  for (const foreground of ['ink', 'muted', 'blue', 'blue-dark', 'accent', 'teal']) {
    test(`AA contrast: ${foreground} text on ${background}`, () => {
      const a = luminance(tokens[foreground]);
      const b = luminance(tokens[background]);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      assert.ok(ratio >= 4.5, `${foreground}/${background}: ${ratio.toFixed(2)} < 4.5`);
    });
  }
}
for (const background of ['blue', 'blue-dark']) {
  for (const foreground of ['paper', 'inverse-muted']) {
    test(`AA inverse contrast: ${foreground} text on ${background}`, () => {
      const a = luminance(tokens[foreground]);
      const b = luminance(tokens[background]);
      assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5);
    });
  }
}

test('AA open status: paper text on the prominent green surface', () => {
  const a = luminance(tokens.paper);
  const b = luminance(tokens.success);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  assert.ok(ratio >= 4.5, `open status contrast ${ratio.toFixed(2)} < 4.5`);
});

// A white image pixel under the lightest 58% black overlay rounds to #6b6b6b.
// All text on the Home image is white; secondary hero titles sit outside photos.
test('AA Home text over worst-case white photograph with the lighter overlay',()=>{
 const background=luminance('#6b6b6b');
 assert.ok((luminance(tokens.paper)+.05)/(background+.05)>=4.5);
 assert.match(css,/rgb\(0 0 0 \/ 58%\)/);
 assert.match(css,/\.home-hero :is\(\.eyebrow,\.hero-intro\) \{ color: var\(--paper\)/);
});
