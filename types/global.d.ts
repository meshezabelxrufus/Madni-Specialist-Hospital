/**
 * Global type declarations
 * Allows TypeScript to accept CSS module and CSS file imports.
 */

// CSS files (side-effect imports like globals.css)
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}
