/**
 * @docs
 * Configuration of a procedural blob. Every field is optional;
 * unspecified fields fall back to the defaults from the original
 * algorithm. Updating any field triggers a new blob generation.
 */
export interface BlobConfig {
  /**
   * Exact number of points in the blob silhouette. Rounded to the
   * nearest even integer (the algorithm alternates two radius
   * functions and requires an even count to close the loop).
   * @default 10
   */
  points?: number
  /**
   * Scale factor for the `g` radius function. Controls the size
   * of odd-indexed lobes.
   * @default 60
   */
  gScale?: number
  /**
   * Scale factor for the `h` radius function. Controls the size
   * of even-indexed lobes and the initial handle.
   * @default 30
   */
  hScale?: number
  /**
   * X coordinate of the blob centre within the SVG viewBox.
   * @default 500
   */
  cx?: number
  /**
   * Y coordinate of the blob centre within the SVG viewBox.
   * @default 220
   */
  cy?: number
  /**
   * When `true`, the generator retries until the resulting path
   * is free of self-intersections and cusps. Automatically
   * disabled when `points > 12`.
   * @default true
   */
  enforceSmooth?: boolean
  /**
   * Override for the `a` radius parameter. When provided the
   * value is used directly instead of a random one.
   */
  a?: number
  /**
   * Override for the `b` radius parameter. When provided the
   * value is used directly instead of a random one.
   */
  b?: number
  /**
   * Override for the `c` radius parameter. When provided the
   * value is used directly instead of a random one.
   */
  c?: number
  /**
   * Fill colour for the front-most blob layer. Back layers
   * fade toward `--md-sys-color-surface-container`.
   * Accepts any CSS colour value (hex, rgb, CSS variable, etc.).
   * @default 'var(--md-sys-color-primary)'
   */
  targetColor?: string
}

/**
 * @docs
 * Properties for the BlobScene widget.
 */
export interface BlobSceneProps extends React.HTMLAttributes<SVGElement> {
  /**
   * Configuration of the blob to render. Updating any field
   * causes the generator to rebuild the blob.
   */
  blob?: BlobConfig
  /**
   * Number of blob layers. Layer 0 is the largest (most faded);
   * the last layer is the smallest and uses the full
   * `targetColor`.
   * @default 3
   */
  layers?: number
  /**
   * Scale increment per layer. Each layer is
   * `1 + (layers - 1 - index) * scaleStep` times the base size.
   * @default 0.15
   */
  scaleStep?: number
}
