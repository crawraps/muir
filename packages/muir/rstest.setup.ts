import { expect } from '@rstest/core'
import * as jestDomMatchers from '@testing-library/jest-dom/matchers'

expect.extend(jestDomMatchers)

// Polyfill Web Animations API for test environment
// anime.js and our AnimeScope rely on Element.prototype.animate
if (typeof Element !== 'undefined' && !Element.prototype.animate) {
  Element.prototype.animate = function (_keyframes: Keyframe[] | PropertyIndexedKeyframes, _options?: number | KeyframeAnimationOptions) {
    // Return a mock Animation that won't throw
    return {
      finished: Promise.resolve(),
      ready: Promise.resolve(),
      effect: null,
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      updatePlaybackRate() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return true
      },
    } as unknown as Animation
  }
}

// Mock for SVGElement as well
if (typeof SVGElement !== 'undefined' && !SVGElement.prototype.animate) {
  SVGElement.prototype.animate = Element.prototype.animate
}
