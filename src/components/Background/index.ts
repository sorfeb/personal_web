/**
 * Background System - Public Exports
 *
 * Layered background architecture:
 * - BackgroundComposer: Main component to render in layout
 * - Types: For extending the system
 * - Animation registry: For adding new animations
 */

export { default as BackgroundComposer } from './BackgroundComposer';
export * from './types';
export * from './layers/animations';
