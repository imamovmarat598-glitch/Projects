# GeoMark App Icon Concepts

## Design Philosophy

GeoMark's icon must communicate three core values:
1. **GPS/Location Precision** - Geographic accuracy and mapping
2. **AI Intelligence** - Smart, automated features
3. **Satellite Technology** - Exclusive Roscosmos integration

Target aesthetics: Modern, professional, tech-forward, trustworthy

---

## Concept A: AI-Powered GPS Navigator

### Visual Description
A central GPS location pin with a modern gradient flowing from blue (#4A90E2) at the base to purple (#8B5CF6) at the top. The pin casts a soft shadow suggesting depth. Behind the pin is a subtle neural network pattern with connected nodes, representing AI processing. A soft glow emanates from the pin's tip, suggesting active intelligence.

### Technical Specifications
- **Base shape**: Teardrop pin (classic GPS marker)
- **Gradient**: Linear, bottom-to-top, #4A90E2 → #8B5CF6
- **Background**: Very light gray (#F5F7FA) with semi-transparent neural network
- **Neural pattern**: 15-20 nodes connected by thin lines (opacity: 15%)
- **Glow effect**: Radial gradient from pin tip (purple, 30% opacity, 20px radius)
- **Shadow**: Drop shadow 0px 4px 12px rgba(0,0,0,0.15)

### Color Palette
- Primary: #4A90E2 (Sky Blue)
- Secondary: #8B5CF6 (Purple)
- Background: #F5F7FA (Light Gray)
- Accent: #FFFFFF (White highlight on pin)

### Implementation Guide
```svg
<!-- Simplified SVG structure -->
<svg width="1024" height="1024" viewBox="0 0 1024 1024">
  <!-- Background circle -->
  <circle cx="512" cy="512" r="512" fill="#F5F7FA"/>

  <!-- Neural network pattern (background layer) -->
  <g opacity="0.15" stroke="#4A90E2" stroke-width="2">
    <!-- Network nodes and connections -->
    <circle cx="300" cy="300" r="8" fill="#4A90E2"/>
    <!-- ... additional nodes ... -->
  </g>

  <!-- Main GPS pin with gradient -->
  <defs>
    <linearGradient id="pinGradient" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#4A90E2"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
    <radialGradient id="glowGradient">
      <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Drop shadow -->
  <ellipse cx="512" cy="750" rx="120" ry="30" fill="rgba(0,0,0,0.15)"/>

  <!-- Pin shape -->
  <path d="M512,250 C400,250 310,340 310,452 C310,564 512,774 512,774 C512,774 714,564 714,452 C714,340 624,250 512,250Z"
        fill="url(#pinGradient)" stroke="#FFFFFF" stroke-width="8"/>

  <!-- Inner circle (white) -->
  <circle cx="512" cy="452" r="60" fill="#FFFFFF"/>

  <!-- GPS dot -->
  <circle cx="512" cy="452" r="30" fill="#4A90E2"/>

  <!-- Glow at tip -->
  <circle cx="512" cy="250" r="80" fill="url(#glowGradient)"/>
</svg>
```

### Pros
- Clear GPS functionality
- Modern gradient trend
- AI suggested through network pattern
- Professional and clean

### Cons
- Neural network might be too subtle at small sizes
- Similar to some existing navigation apps

---

## Concept B: Satellite Intelligence

### Visual Description
A stylized satellite (inspired by Russian space design) orbits around Earth. The Earth shows a hemisphere focusing on Russia/Eurasia with blue oceans and green continents. A camera lens is integrated into the central GPS marker on Earth's surface. The satellite has solar panels and a metallic blue finish. Thin orbital lines trace the satellite's path.

### Technical Specifications
- **Earth hemisphere**: 60% of icon, centered
- **Gradient**: Radial for Earth (#1E3A5F dark blue → #4A90E2 light blue for oceans)
- **Continents**: #50C878 (Emerald green) with simplified landmass shapes
- **Satellite**: Metallic gradient (#6B7280 → #E5E7EB) with blue accent panels
- **Orbital lines**: 2-3 thin elliptical paths (white, 20% opacity)
- **GPS marker**: Red (#FF6B6B) pin on Earth surface
- **Background**: Deep space gradient (#0F172A → #1E293B)

### Color Palette
- Ocean Blue: #4A90E2
- Land Green: #50C878
- Satellite Metal: #6B7280 → #E5E7EB
- GPS Pin: #FF6B6B (Coral Red)
- Space: #0F172A → #1E293B

### Implementation Guide
```svg
<svg width="1024" height="1024" viewBox="0 0 1024 1024">
  <!-- Space background -->
  <defs>
    <radialGradient id="space">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </radialGradient>
    <radialGradient id="earth" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#4A90E2"/>
      <stop offset="70%" stop-color="#1E3A5F"/>
    </radialGradient>
  </defs>

  <circle cx="512" cy="512" r="512" fill="url(#space)"/>

  <!-- Stars (small white dots) -->
  <circle cx="150" cy="150" r="3" fill="#FFFFFF" opacity="0.6"/>
  <!-- ... more stars ... -->

  <!-- Orbital paths -->
  <ellipse cx="512" cy="512" rx="400" ry="200"
           fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.2"/>

  <!-- Earth hemisphere -->
  <circle cx="512" cy="512" r="280" fill="url(#earth)"/>

  <!-- Continents (Russia/Eurasia simplified) -->
  <path d="M450,380 Q550,350 650,400 L680,480 Q620,520 550,510 L480,520 Z"
        fill="#50C878" opacity="0.9"/>

  <!-- GPS marker on Earth -->
  <path d="M512,420 L492,460 L532,460 Z" fill="#FF6B6B"/>
  <circle cx="512" cy="450" r="15" fill="#FF6B6B" stroke="#FFFFFF" stroke-width="3"/>

  <!-- Satellite -->
  <g transform="translate(750,280)">
    <!-- Satellite body -->
    <rect x="-40" y="-20" width="80" height="40" rx="5"
          fill="url(#satelliteMetal)"/>
    <!-- Solar panels -->
    <rect x="-80" y="-10" width="35" height="20" fill="#4A90E2"/>
    <rect x="45" y="-10" width="35" height="20" fill="#4A90E2"/>
    <!-- Antenna -->
    <line x1="0" y1="-20" x2="0" y2="-40" stroke="#E5E7EB" stroke-width="3"/>
  </g>
</svg>
```

### Pros
- Unique: Explicitly shows Roscosmos satellite theme
- Tells complete story: Earth, satellite, GPS
- No competitor has space-themed icon
- Premium, high-tech aesthetic

### Cons
- Complex: May lose detail at small sizes
- Earth rendering could look generic
- Requires careful execution to avoid looking cluttered

---

## Concept C: Smart Camera Lens

### Visual Description
A camera lens aperture dominates the icon, rendered in 3D perspective with visible aperture blades. GPS coordinates ("55.7558° N, 37.6173° E") are overlaid on the lens glass with a digital display font. Inside the aperture blades, a microchip/circuit pattern represents AI. The lens transitions from camera black at the outer ring to tech blue toward the center.

### Technical Specifications
- **Lens outer ring**: Dark gradient (#1F2937 → #374151)
- **Aperture blades**: 8 blades arranged in octagon, light gray (#D1D5DB)
- **Inner gradient**: #374151 → #4A90E2 (center)
- **Coordinates text**: White, monospace font (Courier/Consolas), size 32px
- **Circuit pattern**: Inside aperture, gold/yellow (#FCD34D) on dark background
- **Highlight**: Lens reflection arc on top-left (white, 40% opacity)

### Color Palette
- Lens Dark: #1F2937 → #374151
- Aperture Blades: #D1D5DB
- Tech Blue: #4A90E2
- Circuit Gold: #FCD34D
- Text White: #FFFFFF

### Implementation Guide
```svg
<svg width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="lensGradient">
      <stop offset="0%" stop-color="#4A90E2"/>
      <stop offset="60%" stop-color="#374151"/>
      <stop offset="100%" stop-color="#1F2937"/>
    </radialGradient>
  </defs>

  <!-- Outer lens ring -->
  <circle cx="512" cy="512" r="480" fill="url(#lensGradient)"/>

  <!-- Ridged texture on outer ring -->
  <g opacity="0.3">
    <!-- Repeated radial lines for lens texture -->
    <line x1="512" y1="32" x2="512" y2="80" stroke="#FFFFFF" stroke-width="2"/>
    <!-- ... 36 lines rotated around center ... -->
  </g>

  <!-- Aperture blades (octagon) -->
  <polygon points="512,200 700,300 800,488 700,676 512,776 324,676 224,488 324,300"
           fill="#D1D5DB" opacity="0.8"/>

  <!-- Inner aperture with circuit pattern -->
  <circle cx="512" cy="512" r="250" fill="#1F2937"/>

  <!-- Circuit pattern -->
  <g stroke="#FCD34D" stroke-width="3" fill="none" opacity="0.6">
    <path d="M412,512 L462,512"/>
    <circle cx="462" cy="512" r="8" fill="#FCD34D"/>
    <path d="M462,512 L512,462"/>
    <!-- ... more circuit paths ... -->
  </g>

  <!-- GPS coordinates overlay -->
  <text x="512" y="480" font-family="Courier" font-size="32"
        fill="#FFFFFF" text-anchor="middle" opacity="0.9">
    55.7558° N
  </text>
  <text x="512" y="520" font-family="Courier" font-size="32"
        fill="#FFFFFF" text-anchor="middle" opacity="0.9">
    37.6173° E
  </text>

  <!-- Lens highlight -->
  <path d="M250,250 Q350,200 450,250"
        stroke="#FFFFFF" stroke-width="20" opacity="0.4"
        fill="none" stroke-linecap="round"/>
</svg>
```

### Pros
- Photography-first (core app function)
- Balances GPS, camera, and AI equally
- Realistic 3D rendering looks premium
- Coordinates make function immediately clear

### Cons
- Might be too literal/obvious
- Coordinates text could be hard to read at small sizes
- Black/gray tones less vibrant than competitors

---

## Concept D: Geo AI Minimalist

### Visual Description
Ultra-minimalist design featuring a simple location pin silhouette. Inside the pin is a brain/neural network pattern representing AI. Clean two-color design with the pin in gradient blue and the inner pattern in accent red. Flat design with a single smooth gradient, no shadows or 3D effects. Perfect scalability to tiny sizes.

### Technical Specifications
- **Pin shape**: Classic teardrop, simplified geometry
- **Gradient**: Linear vertical, #4A90E2 (top) → #2563EB (bottom)
- **Inner brain pattern**: Simplified neural network, 6-8 nodes
- **Pattern color**: #FF6B6B (Coral red) for high contrast
- **Background**: Pure white (#FFFFFF) or transparent
- **Border**: None or very subtle (#E5E7EB, 2px)
- **Style**: Flat design, no shadows

### Color Palette
- Pin Blue: #4A90E2 → #2563EB
- Brain/AI Red: #FF6B6B
- Background: #FFFFFF or transparent
- Optional border: #E5E7EB

### Implementation Guide
```svg
<svg width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="pinSimple" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4A90E2"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>

  <!-- Background (white or transparent) -->
  <rect width="1024" height="1024" fill="#FFFFFF"/>

  <!-- GPS pin shape -->
  <path d="M512,200 C390,200 290,300 290,422 C290,544 512,824 512,824 C512,824 734,544 734,422 C734,300 634,200 512,200Z"
        fill="url(#pinSimple)"/>

  <!-- Neural network pattern (simplified) -->
  <g stroke="#FF6B6B" stroke-width="6" fill="#FF6B6B">
    <!-- Central brain shape (abstract) -->
    <circle cx="512" cy="422" r="100" fill="none" stroke-width="8"/>

    <!-- Nodes -->
    <circle cx="460" cy="380" r="12"/>
    <circle cx="564" cy="380" r="12"/>
    <circle cx="480" cy="440" r="12"/>
    <circle cx="544" cy="440" r="12"/>
    <circle cx="512" cy="400" r="15"/>
    <circle cx="512" cy="455" r="12"/>

    <!-- Connections -->
    <line x1="460" y1="380" x2="512" y2="400" stroke-width="4"/>
    <line x1="564" y1="380" x2="512" y2="400" stroke-width="4"/>
    <line x1="512" y1="400" x2="480" y2="440" stroke-width="4"/>
    <line x1="512" y1="400" x2="544" y2="440" stroke-width="4"/>
    <line x1="480" y1="440" x2="512" y2="455" stroke-width="4"/>
    <line x1="544" y1="440" x2="512" y2="455" stroke-width="4"/>
  </g>
</svg>
```

### Pros
- Ultra-clean, modern minimalist trend
- Perfect scalability to all sizes
- Instant recognition of location function
- AI element is clear but not overwhelming
- Highly distinctive simple design

### Cons
- Might be TOO simple compared to rich competitor icons
- Less opportunity to showcase all features (satellite, camera)
- Red/blue combo common in tech

---

## Concept E: Earth Tech (RECOMMENDED)

### Visual Description
A stylized Earth hemisphere showing Russia/Eurasia region with simplified continents. A GPS pin "penetrates" through the Earth from space, suggesting precision and global reach. Thin orbital rings circle the Earth, representing satellite coverage. Blue-green gradient for the planet (#4A90E2 ocean → #50C878 land). The GPS pin has a subtle AI glow effect at the top (purple halo).

### Technical Specifications
- **Earth size**: 70% of icon (centered, slight bottom offset)
- **Ocean gradient**: Radial, #4A90E2 (light) → #0369A1 (deep)
- **Land color**: #50C878 (Emerald) with #34D399 highlights
- **GPS pin**: Red (#FF6B6B) with white outline (4px)
- **Pin gradient**: Solid red with subtle highlight on one side (#FCA5A5)
- **Orbital rings**: 2 elliptical rings, white (#FFFFFF), 15% opacity, 3px width
- **AI glow**: Purple (#8B5CF6) radial gradient at pin top, 25% opacity
- **Background**: Deep space (#0F172A) with subtle stars
- **Shadow**: Earth casts shadow on space background

### Color Palette
- Ocean: #4A90E2 → #0369A1
- Land: #50C878 (with #34D399 highlights)
- GPS Pin: #FF6B6B (with #FCA5A5 highlight)
- Orbital Rings: #FFFFFF (15% opacity)
- AI Glow: #8B5CF6 (25% opacity)
- Space: #0F172A
- Stars: #FFFFFF (varying opacity)

### Implementation Guide
```svg
<svg width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <!-- Ocean gradient -->
    <radialGradient id="ocean" cx="40%" cy="40%">
      <stop offset="0%" stop-color="#4A90E2"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </radialGradient>

    <!-- AI glow -->
    <radialGradient id="aiGlow">
      <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>

    <!-- Pin highlight -->
    <linearGradient id="pinHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF6B6B"/>
      <stop offset="50%" stop-color="#FCA5A5"/>
      <stop offset="100%" stop-color="#FF6B6B"/>
    </linearGradient>
  </defs>

  <!-- Deep space background -->
  <rect width="1024" height="1024" fill="#0F172A"/>

  <!-- Stars scattered -->
  <circle cx="100" cy="100" r="2" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="900" cy="150" r="3" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="200" cy="800" r="2" fill="#FFFFFF" opacity="0.7"/>
  <!-- ... 15-20 more stars of varying sizes and opacity ... -->

  <!-- Earth shadow (subtle) -->
  <ellipse cx="512" cy="850" rx="280" ry="40" fill="#000000" opacity="0.3"/>

  <!-- Earth hemisphere -->
  <circle cx="512" cy="580" r="350" fill="url(#ocean)"/>

  <!-- Continents (Russia/Eurasia simplified shape) -->
  <path d="M350,450 Q450,420 550,430 L620,460 Q650,520 600,580 L550,600 Q480,610 420,590 L360,550 Q340,500 350,450Z"
        fill="#50C878" opacity="0.95"/>

  <!-- Continent highlights (to show depth) -->
  <path d="M400,460 Q460,450 510,455"
        stroke="#34D399" stroke-width="4" opacity="0.6" fill="none"/>

  <!-- Orbital rings -->
  <ellipse cx="512" cy="580" rx="420" ry="180"
           fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.15"
           transform="rotate(-15 512 580)"/>
  <ellipse cx="512" cy="580" rx="460" ry="140"
           fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.15"
           transform="rotate(25 512 580)"/>

  <!-- GPS pin penetrating Earth -->
  <!-- Pin shadow on Earth -->
  <ellipse cx="520" cy="540" rx="30" ry="10" fill="#000000" opacity="0.2"/>

  <!-- Pin body -->
  <path d="M512,180 C450,180 400,230 400,292 C400,354 512,540 512,540 C512,540 624,354 624,292 C624,230 574,180 512,180Z"
        fill="url(#pinHighlight)" stroke="#FFFFFF" stroke-width="6"/>

  <!-- Pin inner circle (white) -->
  <circle cx="512" cy="292" r="50" fill="#FFFFFF"/>

  <!-- GPS dot (blue) -->
  <circle cx="512" cy="292" r="25" fill="#4A90E2"/>

  <!-- AI glow at pin top -->
  <circle cx="512" cy="180" r="100" fill="url(#aiGlow)"/>

  <!-- Small pulse rings for "active" feeling (optional) -->
  <circle cx="512" cy="292" r="70" fill="none" stroke="#8B5CF6"
          stroke-width="2" opacity="0.3"/>
  <circle cx="512" cy="292" r="85" fill="none" stroke="#8B5CF6"
          stroke-width="2" opacity="0.15"/>
</svg>
```

### Pros
- **Most comprehensive**: Shows GPS, Earth/geography, satellite coverage, AI
- **Unique Russian focus**: Earth shows Eurasia prominently
- **Global yet local**: Appeals to international market while highlighting origin
- **Story-rich**: Pin from space to Earth tells precision story
- **Distinctive**: No competitor uses this Earth + pin + orbit combination
- **Premium feel**: Complex but not cluttered, sophisticated

### Cons
- Most complex to execute properly
- Requires skilled designer or AI tool prompting
- Earth rendering must be recognizable at small sizes

---

## Comparison Matrix

| Criterion | Concept A | Concept B | Concept C | Concept D | Concept E |
|-----------|-----------|-----------|-----------|-----------|-----------|
| **GPS Clarity** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★★ |
| **AI Representation** | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★★★ | ★★★★☆ |
| **Satellite/Space** | ★★☆☆☆ | ★★★★★ | ★★☆☆☆ | ★☆☆☆☆ | ★★★★★ |
| **Scalability** | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ | ★★★☆☆ |
| **Uniqueness** | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| **Modern Aesthetic** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★☆ |
| **Professional Look** | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★★★ |
| **Execution Difficulty** | Medium | High | High | Low | High |
| **Market Differentiation** | Medium | High | Medium | Medium | Very High |

---

## Recommendation: Concept E "Earth Tech"

**Why Concept E is the best choice:**

1. **Complete Feature Representation**: Only design that shows GPS, AI, satellite, and global reach
2. **Unique Market Position**: No GPS camera app uses Earth + orbital rings + pin combination
3. **Russian Market Appeal**: Earth showing Eurasia creates local connection while maintaining global appeal
4. **Premium Positioning**: Sophisticated design matches $4.99-$14.99 pricing tier
5. **Story-Driven**: Visual narrative of "space technology reaching Earth" aligns with Roscosmos partnership
6. **Roscosmos Synergy**: Orbital rings directly reference satellite coverage, making partnership visible

**Implementation Priority:**
- **Must-have**: Recognizable Earth with clear Russia/Eurasia landmass
- **Must-have**: Clean GPS pin with good contrast against Earth
- **Important**: Orbital rings visible but subtle
- **Important**: AI glow at pin top
- **Nice-to-have**: Animated version for website (pin pulsing, rings rotating)

---

## Next Steps

1. **User Selection**: Review all 5 concepts and select primary + 1 backup
2. **Designer Brief**: If using human designer, provide this document + color codes
3. **AI Generation**: If using AI (DALL-E, Midjourney), use prompts from "AI Prompt Guide" section below
4. **Iteration**: Create 3 variations of selected concept with minor tweaks
5. **Testing**: Export at all required sizes and test legibility
6. **Feedback**: Show to 5-10 target users for recognition testing

---

## AI Image Generation Prompts

### For Concept E (Recommended)

**DALL-E Prompt:**
```
Create a modern mobile app icon, 1024x1024px. Show a realistic Earth hemisphere from space, focusing on Russia and Eurasia continent in emerald green (#50C878) against deep blue oceans (#4A90E2). A bright red GPS location pin (#FF6B6B) penetrates through the Earth from space above. Two thin white orbital rings circle the Earth at different angles, representing satellite coverage. The pin has a subtle purple AI glow (#8B5CF6) at its top. Deep space background (#0F172A) with scattered stars. Professional, clean, modern design. Flat illustration style with subtle gradients. High contrast, suitable for app icon.
```

**Midjourney Prompt:**
```
mobile app icon design, Earth globe showing Eurasia continent, emerald green landmass, blue ocean gradient, red GPS pin penetrating from space, white orbital rings, purple AI glow effect, deep space background, professional tech aesthetic, flat design with gradients, clean modern style, 1024x1024, high contrast --ar 1:1 --v 6 --style raw
```

**Figma/Manual Design Steps:**
1. Create 1024×1024 artboard with #0F172A background
2. Add scattered star circles (2-3px, white, varying opacity)
3. Draw 700px circle for Earth at center-bottom
4. Apply radial gradient: #4A90E2 (center) → #0369A1 (edge)
5. Draw simplified Eurasia landmass path in #50C878
6. Add continent highlight stroke (#34D399)
7. Draw 2 ellipses for orbital rings (white, 3px stroke, 15% opacity, rotated)
8. Draw GPS pin path (teardrop shape) in #FF6B6B with white 6px stroke
9. Add white circle + blue dot inside pin top
10. Add radial gradient circle at pin top (#8B5CF6, 25% opacity, blur 20px)
11. Export as PNG at all required sizes

---

## File Deliverables

After design completion, create:

1. **Source File**: `icon-source.svg` or `icon-source.fig`
2. **iOS Assets**:
   - `icon-1024.png` (1024×1024, App Store)
   - `icon-180.png` (180×180, iPhone)
   - `icon-167.png` (167×167, iPad Pro)
   - Additional iOS sizes per Phase 4 spec
3. **Android Assets**:
   - `icon-512.png` (512×512, Play Store)
   - `adaptive-icon-foreground.png` (432×432)
   - `adaptive-icon-background.png` (432×432, solid color or pattern)
   - Additional Android sizes per Phase 4 spec
4. **Marketing Assets**:
   - `feature-graphic.png` (1024×500, Google Play)
   - `icon-with-text.png` (1280×720, promotional)
   - `icon-rounded.png` (1024×1024, for social media)

---

## Adaptive Icon Strategy (Android)

For Android's adaptive icon system, split Concept E into:

**Foreground Layer** (432×432, transparent background):
- GPS pin only
- Orbital rings
- AI glow
- Centered in safe zone (288×288 center area)

**Background Layer** (432×432):
- Deep space gradient
- Earth hemisphere
- Stars
- Fills entire 432×432 area

This ensures that when the system applies different shapes (circle, squircle, rounded square), the critical elements (pin) remain visible while the Earth provides attractive background in any shape.

---

## Brand Consistency Check

After icon creation, verify consistency with:
- [ ] Website logo at [geomark/public] matches icon design language
- [ ] Splash screen [GeoMarkApp/assets/splash-icon.png] uses same Earth/pin
- [ ] Primary brand color #4A90E2 is used consistently
- [ ] Social media profile images (circular crop) are legible
- [ ] Icon works in both light and dark mode contexts

---

**Document Version**: 1.0
**Last Updated**: 2026-01-16
**Status**: Ready for design implementation
