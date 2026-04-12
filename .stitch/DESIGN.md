# Design System: Viral 3D Futuristic Portfolio

This design system is optimized for **Stitch & Spline** integration, drawing from viral Twitter design trends (2024-2025).

## 1. Atmosphere & Vibe
- **Style**: Futuristic Minimalist / Cyber-Industrial.
- **Vibe**: Immersive, premium, and motion-heavy.
- **Keywords**: Glassmorphism, Neon Glow, Bento Grid, Floating 3D, High-contrast dark mode.

## 2. Color Palette
- **Background**: `#050505` (Deep Space Black)
- **Primary Accent**: `#00F0FF` (Electric Cyan) - Used for buttons, glow effects, and highlights.
- **Secondary Accent**: `#FF007A` (Cyber Magenta) - Used for callouts and secondary CTAs.
- **Surface**: `rgba(255, 255, 255, 0.03)` (Frosted Glass)
- **Text**: `#FFFFFF` (High readability white), `#A0A0A0` (Muted silver for secondary text)

## 3. Typography
- **Primary Font**: `Outfit` or `Inter` (Sans-serif)
- **Headings**: Extra Bold, wide tracking, uppercase for hero titles.
- **Body**: Regular, tight line-height, minimalist styling.

## 4. Components & Layout
- **Bento Grids**: Use modular, rounded corner cards (`border-radius: 24px`) to organize "Feature" or "Project" sections.
- **Glassmorphism**: Objects should have `backdrop-filter: blur(20px)` and subtle white borders (`1px solid rgba(255,255,255,0.1)`).
- **Interactive 3D**: Every page should have a primary Spline scene as a focal point (Hero, Footer, or Section backgrounds).

## 5. Motion (GSAP + ScrollTrigger)
- **Reveal**: Smooth opacity and Y-offset reveals for text.
- **3D Sync**: Spline objects should rotate or scale based on scroll position.

---

## 6. Design System Notes for Stitch Generation
> **Note to Stitch**: When generating components, prioritize:
> 1. **Desktop-first**, responsive for mobile.
> 2. **Dark Mode only**: Use deep black backgrounds and neon primary colors.
> 3. **Bento Layouts**: Organize content into grouped, rounded tiles.
> 4. **Micro-interactions**: Add hover states that increase neon glow or scale card size (+2%).
> 5. **Whitespace**: Use generous padding (64px+) between sections to highlight 3D elements.
