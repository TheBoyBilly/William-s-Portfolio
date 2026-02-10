/**
 * PREMIUM MOVING BACKGROUND SYSTEM
 * Manages animated backgrounds with accessibility in mind
 * 
 * Features:
 * - Respects prefers-reduced-motion
 * - Allows runtime customization of animation speeds
 * - Provides utilities for controlling background animations
 */

class MovingBackgroundController {
  constructor() {
    this.isReducedMotionEnabled = this.checkReducedMotion();
    this.animationVars = {
      'slow': '--bg-motion-slow',
      'medium': '--bg-motion-medium',
      'fast': '--bg-motion-fast'
    };
    
    this.init();
  }

  /**
   * Check if user has prefers-reduced-motion enabled
   * @returns {boolean}
   */
  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Initialize the controller
   * - Listen for changes to prefers-reduced-motion
   * - Apply initial settings
   */
  init() {
    // Listen for changes to prefers-reduced-motion setting
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.isReducedMotionEnabled = e.matches;
      this.applyMotionPreferences();
    });

    // Apply initial motion preferences
    this.applyMotionPreferences();
  }

  /**
   * Apply motion preferences based on user settings
   */
  applyMotionPreferences() {
    const root = document.documentElement;
    
    if (this.isReducedMotionEnabled) {
      // Disable all animations
      root.style.setProperty('--bg-motion-slow', '0s');
      root.style.setProperty('--bg-motion-medium', '0s');
      root.style.setProperty('--bg-motion-fast', '0s');
      console.log('🎬 Reduced motion enabled — animations disabled');
    } else {
      // Reset to default values (CSS defaults will apply)
      root.style.removeProperty('--bg-motion-slow');
      root.style.removeProperty('--bg-motion-medium');
      root.style.removeProperty('--bg-motion-fast');
      console.log('🎬 Full motion enabled — animations active');
    }
  }

  /**
   * Customize animation speed
   * @param {string} speed - 'slow', 'medium', or 'fast'
   * @param {string} duration - CSS duration value (e.g., '30s', '60s', '90s')
   */
  setAnimationSpeed(speed, duration) {
    if (!this.animationVars[speed]) {
      console.error(`Invalid speed: ${speed}. Use 'slow', 'medium', or 'fast'.`);
      return;
    }

    if (this.isReducedMotionEnabled) {
      console.warn('Cannot set animation speed — reduced motion is enabled by user');
      return;
    }

    const varName = this.animationVars[speed];
    document.documentElement.style.setProperty(varName, duration);
    console.log(`✓ Set ${speed} animation to ${duration}`);
  }

  /**
   * Disable animations completely (overrides user preference)
   * Use sparingly — respect user's prefers-reduced-motion
   */
  disableAnimations() {
    const root = document.documentElement;
    root.style.setProperty('--bg-motion-slow', '0s');
    root.style.setProperty('--bg-motion-medium', '0s');
    root.style.setProperty('--bg-motion-fast', '0s');
    console.log('✓ All animations disabled');
  }

  /**
   * Enable animations (if not in reduced motion mode)
   */
  enableAnimations() {
    if (!this.isReducedMotionEnabled) {
      this.applyMotionPreferences();
      console.log('✓ Animations enabled');
    }
  }

  /**
   * Get current motion preference status
   * @returns {object} { isReducedMotion: boolean, speeds: object }
   */
  getStatus() {
    const root = document.documentElement;
    const styles = getComputedStyle(root);

    return {
      isReducedMotion: this.isReducedMotionEnabled,
      currentSpeeds: {
        slow: styles.getPropertyValue('--bg-motion-slow').trim(),
        medium: styles.getPropertyValue('--bg-motion-medium').trim(),
        fast: styles.getPropertyValue('--bg-motion-fast').trim()
      }
    };
  }

  /**
   * Add moving background to a specific element
   * @param {HTMLElement} element - Target element
   * @param {string} animationType - 'float', 'gradient', or 'scale'
   */
  addMovingBackground(element, animationType = 'gradient') {
    if (!element) {
      console.error('Element not found');
      return;
    }

    element.setAttribute('data-moving-bg', 'true');
    console.log(`✓ Added moving background (${animationType}) to element`, element);
  }
}

// Initialize the controller when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.movingBgController = new MovingBackgroundController();
  });
} else {
  window.movingBgController = new MovingBackgroundController();
}

/**
 * USAGE EXAMPLES IN BROWSER CONSOLE:
 * 
 * View current status:
 * window.movingBgController.getStatus()
 * 
 * Adjust animation speeds:
 * window.movingBgController.setAnimationSpeed('slow', '60s')
 * window.movingBgController.setAnimationSpeed('medium', '90s')
 * window.movingBgController.setAnimationSpeed('fast', '120s')
 * 
 * Disable/enable animations:
 * window.movingBgController.disableAnimations()
 * window.movingBgController.enableAnimations()
 * 
 * Add moving background to custom elements:
 * const section = document.querySelector('#projects')
 * window.movingBgController.addMovingBackground(section, 'float')
 */
