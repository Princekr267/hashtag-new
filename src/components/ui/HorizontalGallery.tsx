import React, { useEffect, useRef, useState } from 'react';
const waitForImages = (container: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length === 0) {
      resolve();
      return;
    }
    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) resolve();
    };
    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onLoad, { once: true });
      }
    });
  });
};

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
  const lastContainerTopRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const onMediaChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', onMediaChange);

    return () => mediaQuery.removeEventListener('change', onMediaChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    // HYDRATION FIX: Prevent SSR crashes
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let cancelled = false;
    let initialized = false;

    const debugLog = (
      hypothesisId: string,
      message: string,
      data: Record<string, unknown>,
      runId = 'initial',
    ) => {
      // Removed debug fetch call
    };

    const measure = () => {
      if (!trackRef.current) return;

      const maxOffset = Math.max(trackRef.current.scrollWidth - window.innerWidth, 0);
      maxOffsetRef.current = maxOffset;
      setSectionHeight('100dvh');
      horizontalOffsetRef.current = Math.min(horizontalOffsetRef.current, maxOffset);
      setHorizontalOffset(horizontalOffsetRef.current);

      debugLog('H1', 'measure-computed', {
        maxOffset,
        scrollWidth: trackRef.current.scrollWidth,
        innerWidth: window.innerWidth,
        images: images.length,
      });
    };

    const isGalleryPinnedInView = () => {
      if (!containerRef.current) return false;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // HYDRATION FIX: More generous threshold for production/fast scrolls
      const lockThreshold = Math.max(40, viewportHeight * 0.1); 
      return Math.abs(rect.top) <= lockThreshold;
    };

    const applyHorizontalDelta = (deltaY: number) => {
      if (maxOffsetRef.current <= 0 || deltaY === 0) return false;
      
      const prev = horizontalOffsetRef.current;
      const canMoveInDirection = (deltaY > 0 && prev < maxOffsetRef.current) || (deltaY < 0 && prev > 0);
      const rect = containerRef.current?.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const pinnedNow = isGalleryPinnedInView();
      const currentTop = rect?.top ?? null;
      const previousTop = lastContainerTopRef.current;

      // HYDRATION FIX: Detect if we jumped over the center point between frames
      const crossedCenterWindow = previousTop != null && currentTop != null && (
        (previousTop > 0 && currentTop <= 0) ||
        (previousTop < 0 && currentTop >= 0) ||
        (Math.abs(currentTop) < viewportHeight * 0.15)
      );
      
      const pinned = pinnedNow || crossedCenterWindow;

      if (hijackLockedRef.current) {
        if (!canMoveInDirection) {
          hijackLockedRef.current = false;
          setHijackActive(false);
          return false;
        }
      } else {
        if (!pinned || !canMoveInDirection) {
          lastContainerTopRef.current = currentTop;
          return false;
        }
        hijackLockedRef.current = true;
        const snapOffset = rect?.top ?? 0;
        if (Math.abs(snapOffset) > 0.5) {
          window.scrollBy({ top: snapOffset, left: 0, behavior: 'auto' });
        }
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
      lastContainerTopRef.current = currentTop;
      return changed || hijackLockedRef.current;
    };

    const setHijackActive = (active: boolean) => {
      if (hijackActiveRef.current === active) return;
      hijackActiveRef.current = active;
      
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      
      // HYDRATION FIX: Robust body scroll lock for non-Lenis devices (native scroll)
      if (active) {
        if (!isTouch) {
          document.body.style.overflow = 'hidden';
        }
        document.body.style.touchAction = isTouch ? 'pan-y' : 'none';
      } else {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      }

      window.dispatchEvent(new CustomEvent('horizontal-gallery-hijack', { detail: { active } }));
    };

    const onWheel = (e: WheelEvent) => {
      const primaryDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const didHijack = applyHorizontalDelta(primaryDelta);
      if (didHijack) e.preventDefault();
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
      if (didHijack) e.preventDefault();
      touchStartYRef.current = currentY;
    };

    const onWindowScroll = () => {
      if (containerRef.current) {
        lastContainerTopRef.current = containerRef.current.getBoundingClientRect().top;
      }
      if (!hijackLockedRef.current && hijackActiveRef.current) {
        setHijackActive(false);
      }
    };

    // HYDRATION FIX: Step 5 - Attach scroll behavior with double-init protection
    const attachScrollBehavior = (target: HTMLElement) => {
      if (target.dataset.scrollInit === 'true') return;
      target.dataset.scrollInit = 'true';

      lastContainerTopRef.current = target.getBoundingClientRect().top;

      // HYDRATION FIX: Use window capture phase to intercept wheel before Lenis/global scrollers
      window.addEventListener('wheel', onWheel, { passive: false, capture: true });
      target.addEventListener('touchstart', onTouchStart, { passive: true });
      target.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('scroll', onWindowScroll, { passive: true });
      window.addEventListener('resize', measure, { passive: true });
      
      measure();
      initialized = true;
    };

    // HYDRATION FIX: Step 2, 3 - Non-blocking readiness loop
    const init = () => {
      if (cancelled || initialized) return;

      let attempts = 0;
      const MAX_ATTEMPTS = 60;

      const tryInit = () => {
        if (cancelled || initialized) return;
        attempts++;

        if (attempts > MAX_ATTEMPTS) {
          console.warn('Horizontal scroll init failed after max attempts');
          return;
        }

        rafId = requestAnimationFrame(() => {
          const track = trackRef.current;
          // Check if ready (has content width)
          if (track && track.scrollWidth > 50) { 
            attachScrollBehavior(container);
          } else {
            tryInit();
          }
        });
      };

      tryInit();
      
      // Still wait for images in background to re-measure for accuracy
      waitForImages(container).then(() => {
        if (!cancelled) measure();
      });
    };

    // HYDRATION FIX: IntersectionObserver to trigger init as soon as section is near
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        init();
        io.disconnect();
      }
    }, { rootMargin: '100% 0px' }); // Load when 1 viewport away
    io.observe(container);

    // HYDRATION FIX: Step 4 - ResizeObserver as final safety net
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && !initialized) {
          init();
        } else if (initialized) {
          measure();
        }
      }
    });
    resizeObserver.observe(container);

    // HYDRATION FIX: Extra safety for production builds - re-measure on load and after a delay
    const handleLoad = () => {
      measure();
      init();
    };
    window.addEventListener('load', handleLoad);
    const safetyTimer = setTimeout(measure, 1500);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener('load', handleLoad);
      clearTimeout(safetyTimer);
      
      // HYDRATION FIX: Step 7 - Cleanup
      window.removeEventListener('wheel', onWheel, { capture: true });
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onWindowScroll);
      window.removeEventListener('resize', measure);
      container.dataset.scrollInit = 'false';
      
      // Ensure scroll is unlocked on unmount
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      setHijackActive(false);
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
                // HYDRATION FIX: Step 6 - Image priority for first cards
                {...({ fetchpriority: i < 2 ? "high" : "low" } as any)}
                loading={i < 2 ? "eager" : "lazy"}
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
                // HYDRATION FIX: Step 6 - Image priority for first cards
                {...({ fetchpriority: i < 2 ? "high" : "low" } as any)}
                loading={i < 2 ? "eager" : "lazy"}
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