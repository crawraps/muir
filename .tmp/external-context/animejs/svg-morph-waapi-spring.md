---
source: Context7 API
library: Anime.js
package: animejs
topic: SVG polygon points animation, path morphing, waapi, spring
fetched: 2026-06-08T00:00:00Z
official_docs: https://animejs.com/documentation
---

# Anime.js v4 – SVG Morphing, Polygon Points, WAAPI & Spring

## 1. Animating SVG Polygon Points (or Path `d`)

### Direct Attribute Animation
Anime.js can animate the `points` attribute of an `<polygon>` (or `<polyline>`) and the `d` attribute of an `<path>` by passing the attribute name as a property to the `animate()` function.

```javascript
import { animate } from 'animejs';

// Animate polygon points directly
animate('polygon', {
  points: '64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100',
  alternate: true,
  loop: true
});
```

> **Note:** Anime.js animates the **string value** of the attribute. It does not accept an array of coordinate pairs like `[[64, 68], ...]` directly. Pass the points as a space-separated string.

### SVG Structure Example

```html
<div class="large centered row">
  <svg width="128" height="128" viewBox="0 0 128 128">
    <filter id="displacementFilter">
      <feTurbulence type="turbulence" numOctaves="2" baseFrequency="0" result="turbulence" />
      <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <polygon points="64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96" fill="currentColor" />
  </svg>
</div>
```

---

## 2. Morphing Between Different Polygon/Path Shapes (`svg.morphTo`)

Use `svg.morphTo()` when you want to interpolate one shape into another. This is the preferred API for morphing because it automatically extrapolates points to ensure smooth transitions.

### API Reference

```javascript
svg.morphTo(shapeTarget, precision)
```

- **shapeTarget** (`CSS selector | SVGPathElement | SVGPolylineElement | SVGPolygonElement`) — The target shape to morph **into**.
- **precision** (`Number`, optional, default: `0.33`) — A value between `0` and `1`. Configures the amount of points generated for the morphing. `0` = no point extrapolation.
- **Returns:** An `Array` containing the shape's starting and final string values.

### Example: Morphing between two polygons

```html
<svg viewBox="0 0 304 112">
  <g stroke-width="2" stroke="currentColor" stroke-linejoin="round" fill="none" fill-rule="evenodd">
    <!-- Visible polygon -->
    <polygon id="path-1" points="152,4 170,38 204,56 170,74 152,108 134,74 100,56 134,38"></polygon>
    <!-- Hidden target polygon (can be updated dynamically) -->
    <polygon style="opacity: 0" id="path-2" points="152,4 170,38 204,56 170,74 152,108 134,74 100,56 134,38"></polygon>
  </g>
</svg>
```

```javascript
import { animate, svg, utils } from 'animejs';

const [$path1, $path2] = utils.$('polygon');

function animateRandomPoints() {
  // 1. Dynamically change the target shape's points
  utils.set($path2, { points: generatePoints() });

  // 2. Morph #path-1 into #path-2
  animate($path1, {
    points: svg.morphTo($path2),  // can also pass a CSS selector string
    ease: 'inOutCirc',
    duration: 500,
    onComplete: animateRandomPoints
  });
}

animateRandomPoints();

// Demo helper: generate a random star/circle-ish polygon
function generatePoints() {
  const total = utils.random(4, 64);
  const r1 = utils.random(4, 56);
  const r2 = 56;
  const isOdd = n => n % 2;
  let points = '';
  for (let i = 0, l = isOdd(total) ? total + 1 : total; i < l; i++) {
    const r = isOdd(i) ? r1 : r2;
    const a = (2 * Math.PI * i / l) - Math.PI / 2;
    const x = 152 + utils.round(r * Math.cos(a), 0);
    const y = 56 + utils.round(r * Math.sin(a), 0);
    points += `${x},${y} `;
  }
  return points;
}
```

### Example: Morphing a path `d` attribute

```javascript
animate('#my-path', {
  d: svg.morphTo('#target-path'), // or an SVGPathElement reference
  duration: 1500,
  ease: 'out(3)',
});
```

---

## 3. Spring (`createSpring`) with SVG Attributes

Spring easing can be combined with the standard `animate()` call. There is no restriction on using it with SVG attributes.

### `createSpring` API

```javascript
import { animate, createSpring } from 'animejs';

createSpring({
  mass: 1,        // Mass of the object (default: 1)
  stiffness: 100, // Spring stiffness (default: 100)
  damping: 10,    // Damping factor (default: 10)
  velocity: 0     // Initial velocity (default: 0)
});
```

### Example: Polygon Points + Spring

```javascript
import { animate, createSpring } from 'animejs';

animate('polygon', {
  points: '64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100',
  alternate: true,
  loop: true,
  ease: createSpring({ stiffness: 100, damping: 10 })
});
```

### Example: Draggable release with spring (context)

```javascript
import { createDraggable, createSpring } from 'animejs';

createDraggable('.square', {
  container: '.grid',
  releaseEase: createSpring({ stiffness: 150, damping: 15 })
});
```

---

## 4. WAAPI (`waapi.animate`) with SVG?

`waapi.animate()` uses the browser's native Web Animations API. The documentation examples (`waapi.animate(...)`) focus on standard CSS properties (`x`, `y`, `rotate`, `translate`, etc.) for HTML elements.

While `waapi` **can** animate any animatable CSS property, SVG attributes such as `points` and `d` are **not CSS properties** in the same way and are not listed in the WAAPI-specific documentation examples. For reliable SVG attribute morphing (especially complex `d` or `points`), use the core `animate()` engine.

### Converting Anime.js easing for raw WAAPI

If you need to use an Anime.js spring or easing function inside the native `element.animate()` API, use `waapi.convertEase`:

```javascript
import { waapi, createSpring } from 'animejs';

const spring = createSpring({ stiffness: 12 });
const linearEasing = waapi.convertEase(spring.ease);

// Use with native Element.animate()
document.querySelector('.square').animate(
  { translate: '17rem', rotate: '1turn' },
  {
    easing: linearEasing,
    duration: spring.duration,
    fill: 'forwards'
  }
);
```

### Basic `waapi.animate` Syntax

```javascript
import { waapi, stagger } from 'animejs';

waapi.animate('.circle', {
  y: [0, -30, 0],
  ease: createSpring({ stiffness: 150, damping: 5 }),
  delay: stagger(75),
  loop: true,
});
```

---

## 5. Does Anime.js support animating arrays of points directly?

**No.** Anime.js does not accept a raw array of numbers like this:

```javascript
// ❌ Not supported
animate('polygon', {
  points: [[64, 68.64], [8.574, 100], ...]
});
```

**Yes** — if you pass the points as a **string** (`'64 68.64 8.574 100 ...'`), Anime.js will interpolate the string values correctly. For true shape morphing with automatic point extrapolation (e.g., a triangle → a hexagon), always use `svg.morphTo()`.

---

## 6. Summary Table

| Task | Recommended API |
|------|----------------|
| Simple `points` tween (string) | `animate('polygon', { points: '...' })` |
| Morph shape A → shape B | `animate(el, { points: svg.morphTo(targetShape) })` |
| Apply spring physics | `createSpring({ stiffness, damping })` passed to `ease` |
| Animate standard CSS props via WAAPI | `waapi.animate(selector, { ... })` |
| Raw array of points | Not directly supported — use string or `morphTo` |
