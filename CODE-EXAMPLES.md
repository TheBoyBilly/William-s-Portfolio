# Code Examples & Implementation Details

## CSS Animation Keyframes Included

### 1. Floating Elements
```css
@keyframes bgFloat {
  0% {
    transform: translateX(-10%) translateY(-10%) scale(1);
  }
  25% {
    transform: translateX(15%) translateY(-5%) scale(1.05);
  }
  50% {
    transform: translateX(20%) translateY(10%) scale(1);
  }
  75% {
    transform: translateX(-5%) translateY(15%) scale(0.95);
  }
  100% {
    transform: translateX(-10%) translateY(-10%) scale(1);
  }
}

@keyframes bgFloatReverse {
  /* Opposite direction for balance */
  0% { transform: translateX(10%) translateY(10%) scale(1); }
  25% { transform: translateX(-15%) translateY(5%) scale(0.95); }
  50% { transform: translateX(-20%) translateY(-10%) scale(1); }
  75% { transform: translateX(5%) translateY(-15%) scale(1.05); }
  100% { transform: translateX(10%) translateY(10%) scale(1); }
}
```

### 2. Gradient Shifts
```css
@keyframes bgGradientShiftHorizontal {
  0% { background-position: 0% 50%; }
  25% { background-position: 25% 50%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes bgGradientShiftDiagonal {
  0% { background-position: 0% 0%; }
  25% { background-position: 25% 25%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 50% 50%; }
  100% { background-position: 0% 0%; }
}
```

---

## Hero Section Implementation

### HTML Structure
```html
<section id="hero" class="hero reveal" aria-labelledby="hero-heading">
  <div class="hero-inner">
    <div class="hero-content">
      <h1 id="hero-heading" class="hero-title">William Lawal</h1>
      <!-- Content here -->
    </div>
    <figure class="hero-visual">
      <!-- Visual elements -->
    </figure>
  </div>
</section>
```

### CSS Implementation
```css
.hero {
  padding: var(--spacing-5xl) var(--spacing-lg);
  background: var(--gradient-dark);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Layer 1: First floating orb */
.hero::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: bgFloat var(--bg-motion-medium) ease-in-out infinite !important;
  transform: translate3d(0, 0, 0); /* GPU acceleration */
}

/* Layer 2: Second floating orb (opposite direction) */
.hero::after {
  content: "";
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: bgFloatReverse calc(var(--bg-motion-medium) * 1.2) ease-in-out infinite reverse !important;
  transform: translate3d(0, 0, 0);
}

/* Layer 3: Gradient shift */
.hero-inner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, calc(var(--bg-element-opacity) * 0.4)) 0%,
    rgba(255, 255, 255, 0) 25%,
    rgba(255, 255, 255, 0) 75%,
    rgba(255, 255, 255, calc(var(--bg-element-opacity) * 0.2)) 100%
  );
  background-size: 200% 200%;
  animation: bgGradientShiftDiagonal var(--bg-motion-slow) ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
  opacity: 0.3;
}

/* Content above animations */
.hero-inner {
  position: relative;
  z-index: 2;
}

.hero-inner > * {
  position: relative;
  z-index: 3;
}
```

---

## Section Container Implementation

### HTML Structure
```html
<section id="about" class="about reveal" data-moving-bg="true" aria-labelledby="about-heading">
  <div class="about-inner">
    <h2 id="about-heading" class="section-title">About</h2>
    <!-- Content here -->
  </div>
</section>
```

### CSS Implementation
```css
/* Generic section with moving background */
section[data-moving-bg="true"] {
  position: relative;
  overflow: hidden;
}

/* Layer 1: Gradient shift background */
section[data-moving-bg="true"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    125deg,
    rgba(255, 255, 255, var(--bg-element-opacity-alt)) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, var(--bg-element-opacity-alt)) 100%
  );
  background-size: 300% 300%;
  animation: bgGradientShiftHorizontal var(--bg-motion-slow) ease-in-out infinite;
  pointer-events: none;
  transform: translate3d(0, 0, 0);
}

/* Layer 2: Floating orb */
section[data-moving-bg="true"]::after {
  content: "";
  position: absolute;
  top: -20%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, var(--bg-element-opacity)) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: bgFloat var(--bg-motion-medium) ease-in-out infinite;
  pointer-events: none;
  transform: translate3d(0, 0, 0);
}

/* Content above background */
.about-inner,
.skills-inner,
.projects-inner {
  position: relative;
  z-index: 2;
}
```

### Section-Specific Overrides
```css
/* Different motion for About section */
.about[data-moving-bg="true"]::after {
  bottom: -15%;
  left: -10%;
  top: auto;
  animation: bgFloatReverse var(--bg-motion-fast) ease-in-out infinite;
}

/* Different motion for Skills section */
.skills[data-moving-bg="true"]::after {
  width: 350px;
  height: 350px;
  animation: bgFloatAndScale calc(var(--bg-motion-medium) * 1.1) ease-in-out infinite;
}

/* Same for Projects */
.projects[data-moving-bg="true"]::after {
  animation: bgFloat var(--bg-motion-medium) ease-in-out infinite;
}
```

---

## JavaScript Controller API

### Initialization
```javascript
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

  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.isReducedMotionEnabled = e.matches;
      this.applyMotionPreferences();
    });
    this.applyMotionPreferences();
  }
}

// Auto-initialize
window.movingBgController = new MovingBackgroundController();
```

### API Methods
```javascript
// Check current status
window.movingBgController.getStatus()
// Returns:
// {
//   isReducedMotion: false,
//   currentSpeeds: {
//     slow: "45s",
//     medium: "60s",
//     fast: "75s"
//   }
// }

// Adjust animation speed
window.movingBgController.setAnimationSpeed('slow', '90s')
window.movingBgController.setAnimationSpeed('medium', '120s')

// Disable all animations
window.movingBgController.disableAnimations()

// Enable animations (if not in reduced motion mode)
window.movingBgController.enableAnimations()

// Add moving background to element
const section = document.querySelector('#testimonials')
window.movingBgController.addMovingBackground(section, 'float')
```

---

## Accessibility Implementation

### Reduced Motion Media Query
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --bg-motion-slow: 0s;
    --bg-motion-medium: 0s;
    --bg-motion-fast: 0s;
  }

  section[data-moving-bg="true"]::before,
  section[data-moving-bg="true"]::after,
  .hero::before,
  .hero::after,
  .hero-inner::before {
    animation: none !important;
    opacity: 1 !important;
  }
}
```

### JavaScript Respect
```javascript
applyMotionPreferences() {
  const root = document.documentElement;
  
  if (this.isReducedMotionEnabled) {
    // Disable all animations
    root.style.setProperty('--bg-motion-slow', '0s');
    root.style.setProperty('--bg-motion-medium', '0s');
    root.style.setProperty('--bg-motion-fast', '0s');
  } else {
    // Enable animations
    root.style.removeProperty('--bg-motion-slow');
    root.style.removeProperty('--bg-motion-medium');
    root.style.removeProperty('--bg-motion-fast');
  }
}
```

---

## Utility Classes

### Using Utility Classes
```html
<!-- Soft gradient shift only -->
<div class="moving-bg--gradient-soft">
  Content with soft gradient shift
</div>

<!-- Medium float -->
<div class="moving-bg--float-medium">
  Content with floating orb
</div>

<!-- High intensity float + scale -->
<div class="moving-bg--float-intense">
  Content with complex animation
</div>
```

### Implementation
```css
.moving-bg--gradient-soft {
  position: relative;
  background-size: 200% 200%;
  animation: bgGradientShiftHorizontal var(--bg-motion-slow) ease-in-out infinite;
}

.moving-bg--float-medium {
  position: relative;
  animation: bgFloat var(--bg-motion-medium) ease-in-out infinite;
}

.moving-bg--float-intense {
  position: relative;
  animation: bgFloatAndScale var(--bg-motion-medium) ease-in-out infinite;
}
```

---

## Custom Animations

### Creating Custom Animation
```css
@keyframes myCustomMotion {
  0% {
    background-position: 0% 0%;
    transform: scale(1) rotate(0deg);
  }
  50% {
    background-position: 100% 100%;
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    background-position: 0% 0%;
    transform: scale(1) rotate(0deg);
  }
}

/* Apply to custom element */
.my-custom-section {
  background: linear-gradient(135deg, #0f0f0f, #2a2a2a);
  background-size: 200% 200%;
  animation: myCustomMotion 60s ease-in-out infinite;
}
```

---

## Performance Optimizations

### GPU Acceleration
```css
.hero,
section[data-moving-bg="true"],
.hero::before,
.hero::after {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}
```

### Will-Change Management
```css
@media (prefers-reduced-motion: no-preference) {
  .hero::before,
  .hero::after,
  section[data-moving-bg="true"]::after {
    will-change: auto; /* Only use when animating */
  }
}

/* Remove will-change when not needed */
@media (prefers-reduced-motion: reduce) {
  * {
    will-change: auto !important;
  }
}
```

---

## Testing Examples

### Console Testing
```javascript
// Test reduced motion detection
const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
console.log('Reduced motion:', mq.matches)

// Monitor animation status
setInterval(() => {
  console.log(window.movingBgController.getStatus())
}, 1000)

// Performance monitoring
performance.mark('animation-start')
// ... perform animations
performance.mark('animation-end')
performance.measure('animation', 'animation-start', 'animation-end')
console.log(performance.getEntriesByName('animation'))
```

---

## Browser Compatibility Checks

### Feature Detection
```javascript
// Check for CSS animations support
const supportsAnimations = () => {
  const animation = document.createElement('div').style.animation
  return animation !== undefined
}

// Check for CSS custom properties support
const supportsCustomProperties = () => {
  return CSS.supports('--test', '0')
}

// Check for transform3d support
const supportsTransform3d = () => {
  const div = document.createElement('div')
  const transforms = ['transform', 'WebkitTransform', 'MozTransform']
  return transforms.some(t => typeof div.style[t] !== undefined)
}
```

---

## Template Usage Examples

### Example 1: Basic Section
```html
<section id="testimonials" data-moving-bg="true">
  <h2>Client Testimonials</h2>
  <p>Content appears here with automatic moving background</p>
</section>
```

### Example 2: Custom Styling
```html
<section id="case-study" data-moving-bg="true" style="--bg-element-opacity: 0.12;">
  <h2>Case Study</h2>
  <p>This section has increased opacity for more visible motion</p>
</section>
```

### Example 3: Conditional Implementation
```javascript
// Dynamically add moving background based on condition
const isMobile = window.innerWidth < 768
const section = document.querySelector('#portfolio')

if (!isMobile) {
  window.movingBgController.addMovingBackground(section, 'float')
}
```

---

This code is production-ready and fully documented for easy modification!
