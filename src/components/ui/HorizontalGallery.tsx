import React, { useEffect, useRef, useState } from 'react';

interface HorizontalGalleryProps {
  images: Array<{ src: string; alt: string }>;
  label?: string;
}

const HorizontalGallery: React.FC<HorizontalGalleryProps> = ({ images, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [centeredIndex, setCenteredIndex] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [sectionHeight, setSectionHeight] = useState('100vh');
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const maxOffsetRef = useRef(0);
  const horizontalOffsetRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const rafPendingRef = useRef(false);
  const hijackActiveRef = useRef(false);
  const hijackLockedRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const onMediaChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', onMediaChange);

    return () => mediaQuery.removeEventListener('change', onMediaChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const measure = () => {
      if (!trackRef.current) return;

      const maxOffset = Math.max(trackRef.current.scrollWidth - window.innerWidth, 0);
      maxOffsetRef.current = maxOffset;
      // Keep the gallery section exactly one viewport tall.
      // Horizontal motion is controlled by wheel/touch hijack, not by extra vertical space.
      setSectionHeight('100dvh');
      horizontalOffsetRef.current = Math.min(horizontalOffsetRef.current, maxOffset);
      setHorizontalOffset(horizontalOffsetRef.current);
    };

    const isGalleryPinnedInView = () => {
      if (!containerRef.current) return false;
      const rect = containerRef.current.getBoundingClientRect();
      const activationTolerancePx = 24;

      // Section is exactly centered when top is 0 (section height is 100vh).
      // Use a tiny symmetric tolerance so up/down activation position is identical.
      return Math.abs(rect.top) <= activationTolerancePx;
    };

    const applyHorizontalDelta = (deltaY: number) => {
      if (maxOffsetRef.current <= 0 || deltaY === 0) return false;
      const prev = horizontalOffsetRef.current;
      const canMoveInDirection =
        (deltaY > 0 && prev < maxOffsetRef.current) || (deltaY < 0 && prev > 0);

      if (hijackLockedRef.current) {
        if (!canMoveInDirection) {
          hijackLockedRef.current = false;
          setHijackActive(false);
          return false;
        }
      } else {
        if (!isGalleryPinnedInView() || !canMoveInDirection) return false;
        hijackLockedRef.current = true;
      }

      const next = Math.max(0, Math.min(maxOffsetRef.current, prev + deltaY));
      const changed = next !== prev;

      horizontalOffsetRef.current = next;
      if (!rafPendingRef.current) {
        rafPendingRef.current = true;
        requestAnimationFrame(() => {
          rafPendingRef.current = false;
          setHorizontalOffset(horizontalOffsetRef.current);
        });
      }
      setHijackActive(true);
      return changed || hijackLockedRef.current;
    };

    const setHijackActive = (active: boolean) => {
      if (hijackActiveRef.current === active) return;
      hijackActiveRef.current = active;
      window.dispatchEvent(
        new CustomEvent('horizontal-gallery-hijack', { detail: { active } }),
      );
    };

    const onWheel = (e: WheelEvent) => {
      const didHijack = applyHorizontalDelta(e.deltaY);
      if (didHijack) {
        e.preventDefault();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current == null) return;
      const currentY = e.touches[0]?.clientY;
      if (currentY == null) return;

      const deltaY = touchStartYRef.current - currentY;
      const didHijack = applyHorizontalDelta(deltaY);
      if (didHijack) {
        e.preventDefault();
      }
      touchStartYRef.current = currentY;
    };

    const onWindowScroll = () => {
      if (!hijackLockedRef.current && hijackActiveRef.current) {
        setHijackActive(false);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    measure();

    return () => {
      hijackLockedRef.current = false;
      setHijackActive(false);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onWindowScroll);
      window.removeEventListener('resize', measure);
    };
  }, [prefersReduced, images]);

  useEffect(() => {
    if (!trackRef.current) return;

    const maxOffset = maxOffsetRef.current;
    const safeOffset = Math.max(0, Math.min(maxOffset, horizontalOffset));
    trackRef.current.style.transform = `translateX(${-safeOffset}px)`;
    setProgress(maxOffset > 0 ? safeOffset / maxOffset : 0);

    const centerOffset = safeOffset + window.innerWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    const items = Array.from(trackRef.current.children) as HTMLElement[];
    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(centerOffset - itemCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = index;
      }
    });

    setCenteredIndex(closestIndex);
  }, [horizontalOffset, images]);

  if (prefersReduced) {
    return (
      <section className="py-20 bg-black overflow-hidden relative border-none">
        {label ? (
          <div className="px-4 md:px-6 mb-6 md:mb-8">
            <p className="text-xs md:text-sm font-label tracking-[0.25em] uppercase text-primary/80">
              {label}
            </p>
          </div>
        ) : null}
        <div className="flex overflow-x-auto gap-4 md:gap-[24px] px-4 md:px-6 pb-8 md:pb-12 snap-x snap-mandatory">
          {images.map((img, i) => (
            <div key={i} className="flex-shrink-0 snap-center">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-[84vw] sm:w-[76vw] md:w-[70vw] h-auto max-h-[65dvh] md:max-h-[74vh] object-contain rounded-[12px]"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef} 
      className="relative m-0 p-0 border-none bg-black" 
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-center bg-black">
        {label ? (
          <div className="absolute top-6 md:top-8 left-[6vw] md:left-[10vw] z-30 pointer-events-none">
            <p className="text-xs md:text-sm font-label tracking-[0.25em] uppercase text-primary/80">
              {label}
            </p>
          </div>
        ) : null}
        
        {/* Horizontal Track */}
        <div 
          ref={trackRef}
          className="flex gap-4 md:gap-[24px] will-change-transform px-[6vw] md:px-[15vw]"
        >
          {images.map((img, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 relative transition-transform duration-500 ease-out"
              style={{
                transform: centeredIndex === i ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-[84vw] sm:w-[76vw] md:w-[70vw] h-auto max-h-[65dvh] md:max-h-[74vh] object-contain rounded-[12px]"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Global Progress Indicator */}
        <div className="absolute bottom-8 left-[10vw] right-[10vw] z-30">
          <div className="h-[4px] w-full bg-white/20 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full will-change-transform"
              style={{ 
                width: `${progress * 100}%`,
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HorizontalGallery;