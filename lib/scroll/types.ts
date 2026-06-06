/**
 * Scroll System — Type Definitions
 * -------------------------------------------------
 * Single source of truth for all scroll-related types.
 */

/** Scene registration config */
export interface SceneConfig {
  id: string
  /** Normalized global progress where this scene begins (0→1) */
  start: number
  /** Normalized global progress where this scene ends (0→1) */
  end: number
}

/** Full scene definition (input format — includes scroll depth) */
export interface SceneDefinition {
  id: string
  /** How many vh of scroll depth this scene consumes */
  scrollVh: number
}

/** Result from useScrollScene hook */
export interface ScrollSceneState {
  /** Local progress within this scene only (0→1) */
  progress: number
  /** Whether the global scroll is currently within this scene's range */
  isActive: boolean
  /** Whether this scene has fully played (progress === 1) */
  isComplete: boolean
  /** Raw global progress (0→1) — useful for relative calculations */
  globalProgress: number
}

/** Options for useScrollScene hook */
export interface UseScrollSceneOptions extends SceneConfig {
  /**
   * Imperative callback fired on every scroll tick.
   * Use this with GSAP (gsap.set / gsap.to) for zero-rerender animations.
   * When provided, React state is NOT updated — only this callback fires.
   *
   * @param progress  Local scene progress 0→1
   * @param isActive  Whether scene is in its active range
   */
  onProgress?: (progress: number, isActive: boolean) => void
  /** Called once when scene enters its active range */
  onEnter?: () => void
  /** Called once when scene leaves its active range */
  onLeave?: () => void
}

/** Subscriber callback type */
export type ProgressSubscriber = (globalProgress: number) => void
