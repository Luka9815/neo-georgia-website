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
 assert.match(css,/rgba\(0, 0, 0, 0\.58\)/);
 assert.match(css,/\.home-hero :is\(\.eyebrow,\s*\.hero-intro\) \{ color: var\(--paper\)/);
});

for(const width of [1024,1280,1440,1920])test(`desktop hero white-pixel contrast at text edge, ${width}px`,()=>{
 const root=width>=1280?17:16;
 const wrapper=Math.min(width,82*root);const padding=2*root;
 const right=(width-wrapper)/2+padding+Math.min(46*root,(wrapper-2*padding)*.58);
 const fraction=right/width;
 const stops=[...[...css.matchAll(/rgb\(5 38 79 \/ ([\d.]+)%\) ([\d.]+)%/g)]].map(m=>({alpha:Number(m[1])/100,x:Number(m[2])/100}));
 assert.equal(stops.length,4);
 const upper=stops.findIndex(s=>s.x>=fraction);assert.ok(upper>0);
 const a=stops[upper-1],b=stops[upper];const alpha=a.alpha+(b.alpha-a.alpha)*(fraction-a.x)/(b.x-a.x);
 const rgb=[5,38,79].map(c=>Math.round(c*alpha+255*(1-alpha)));
 const background='#'+rgb.map(c=>c.toString(16).padStart(2,'0')).join('');
 const ratio=(luminance('#ffffff')+.05)/(luminance(background)+.05);
 assert.ok(ratio>=4.5,`${fraction}: ${ratio}`);
 assert.match(css,/width: min\(46rem,58%\)/);
});
