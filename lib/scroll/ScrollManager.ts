/**
 * ScrollManager — Singleton Scroll State Machine
 * -------------------------------------------------
 * This is the BRAIN of the entire scroll system.
 *
 * WHAT IT DOES:
 *  - Maintains a registry of all scroll scenes (id + range)
 *  - Receives global progress (0→1) from ScrollStage's master ScrollTrigger
 *  - Notifies all subscribers (scenes) on every scroll tick
 *  - Computes local progress for each scene on demand
 *
 * SINGLETON PATTERN:
 *  Only one instance exists for the entire app lifetime.
 *  This ensures all scenes share exactly the same progress value
 *  with zero drift between components.
 *
 * PERFORMANCE:
 *  - Uses a Set for O(1) subscribe/unsubscribe
 *  - Map for O(1) scene lookup
 *  - Zero React state — pure imperative updates
 *  - Notifications fire synchronously within the GSAP tick
 *    so there's no async gap between scroll position and animation
 *
 * BROWSER-SAFE:
 *  Lazy initialization — only created when first accessed,
 *  never on the server during SSR.
 */

import type { SceneConfig, ProgressSubscriber } from './types'

class ScrollManager {
  private static _instance: ScrollManager | null = null

  /** Scene registry: id → { start, end } */
  private scenes = new Map<string, SceneConfig>()

  /** Active progress subscribers (scene hooks) */
  private subscribers = new Set<ProgressSubscriber>()

  /** Current global scroll progress 0→1 */
  private _progress = 0

  // Prevent external construction
  private constructor() {}

  // ── Singleton Access ─────────────────────────────────────
  static get instance(): ScrollManager {
    if (!ScrollManager._instance) {
      ScrollManager._instance = new ScrollManager()
    }
    return ScrollManager._instance
  }

  // ── Scene Registry ───────────────────────────────────────

  /**
   * Register a scene with its normalized progress range.
   * Returns an unregister cleanup function.
   */
  registerScene(config: SceneConfig): () => void {
    this.scenes.set(config.id, { ...config })
    return () => this.scenes.delete(config.id)
  }

  // ── Progress Dispatch ────────────────────────────────────

  /**
   * Called by ScrollStage's master ScrollTrigger on every scroll frame.
   * This is the ONLY place where global progress changes.
   *
   * Subscribers (useScrollScene hooks) fire synchronously here —
   * same GSAP tick, same frame, zero lag.
   */
  updateProgress(progress: number): void {
    this._progress = progress
    this.subscribers.forEach((fn) => {
      try {
        fn(progress)
      } catch (err) {
        console.error('[ScrollManager] Subscriber threw — scene animations may be broken:', err)
      }
    })
  }

  // ── Subscriber API ───────────────────────────────────────

  /**
   * Subscribe to global progress updates.
   * Returns an unsubscribe cleanup function.
   */
  subscribe(fn: ProgressSubscriber): () => void {
    this.subscribers.add(fn)
    return () => this.subscribers.delete(fn)
  }

  // ── Scene Progress Computation ───────────────────────────

  /**
   * Get the LOCAL progress (0→1) for a specific scene.
   *
   * Mapping:
   *   global < scene.start  → 0   (not started)
   *   global = scene.start  → 0   (just entered)
   *   global = scene.end    → 1   (just exited)
   *   global > scene.end    → 1   (completed)
   *
   * Clamped to [0, 1] — scenes never go negative or over 100%.
   */
  getSceneProgress(id: string): number {
    const scene = this.scenes.get(id)
    if (!scene) return 0

    const range = scene.end - scene.start
    if (range <= 0) return 0

    return Math.max(0, Math.min(1, (this._progress - scene.start) / range))
  }

  /**
   * Check if a scene is currently in its active scroll range.
   * A scene is active when: scene.start <= globalProgress <= scene.end
   */
  isSceneActive(id: string): boolean {
    const scene = this.scenes.get(id)
    if (!scene) return false
    return this._progress >= scene.start && this._progress <= scene.end
  }

  // ── Accessors ────────────────────────────────────────────

  get globalProgress(): number {
    return this._progress
  }

  get sceneCount(): number {
    return this.scenes.size
  }

  // ── Cleanup ──────────────────────────────────────────────

  /**
   * Full reset — call when the scroll stage unmounts.
   * Clears all scenes and subscribers, resets progress to 0.
   */
  reset(): void {
    this.scenes.clear()
    this.subscribers.clear()
    this._progress = 0
  }
}

/**
 * Get the global ScrollManager singleton.
 * Safe to call on client only — never call during SSR.
 */
export const getScrollManager = (): ScrollManager => ScrollManager.instance

export type { SceneConfig, ProgressSubscriber }
