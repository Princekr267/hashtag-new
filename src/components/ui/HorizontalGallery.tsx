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

    const debugLog = (
      hypothesisId: string,
      message: string,
      data: Record<string, unknown>,
      runId = 'initial',
    ) => {
      // #region agent log
      fetch('http://127.0.0.1:7680/ingest/76688da9-d7ac-46f6-b318-0af7b3c91abc',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8d80e5'},body:JSON.stringify({sessionId:'8d80e5',runId,hypothesisId,location:'HorizontalGallery.tsx',message,data,timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    };

    const measure = () => {
      if (!trackRef.current) return;

      const maxOffset = Math.max(trackRef.current.scrollWidth - window.innerWidth, 0);
      maxOffsetRef.current = maxOffset;
      // Keep the gallery section exactly one viewport tall.
      // Horizontal motion is controlled by wheel/touch hijack, not by extra vertical space.
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
      const lockThreshold = Math.max(24, Math.min(56, viewportHeight * 0.06));
      const isCentered = Math.abs(rect.top) <= lockThreshold;

      return isCentered;
    };

    const applyHorizontalDelta = (deltaY: number) => {
      if (maxOffsetRef.current <= 0 || deltaY === 0) {
        debugLog('H1', 'apply-rejected-no-range-or-zero-delta', {
          maxOffset: maxOffsetRef.current,
          deltaY,
        });
        return false;
      }
      const prev = horizontalOffsetRef.current;
      const canMoveInDirection =
        (deltaY > 0 && prev < maxOffsetRef.current) || (deltaY < 0 && prev > 0);
      const rect = containerRef.current?.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const lockThreshold = Math.max(24, Math.min(56, viewportHeight * 0.06));
      const centerDistance = rect
        ? Math.abs((rect.top + rect.bottom) / 2 - viewportHeight / 2)
        : null;
      const pinnedNow = isGalleryPinnedInView();
      const currentTop = rect?.top ?? null;
      const previousTop = lastContainerTopRef.current;
      const scrollDirection = deltaY > 0 ? 'down' : 'up';
      const crossedCenterWindow =
        previousTop != null &&
        currentTop != null &&
        ((previousTop > lockThreshold && currentTop < -lockThreshold) ||
          (previousTop < -lockThreshold && currentTop > lockThreshold) ||
          (previousTop > 0 && currentTop <= 0) ||
          (previousTop < 0 && currentTop >= 0));
      const pinned = pinnedNow || crossedCenterWindow;

      if (hijackLockedRef.current) {
        if (!canMoveInDirection) {
          hijackLockedRef.current = false;
          setHijackActive(false);
          debugLog('H4', 'hijack-unlocked-at-boundary', {
            prev,
            maxOffset: maxOffsetRef.current,
            deltaY,
          });
          return false;
        }
      } else {
        if (!pinned || !canMoveInDirection) {
          debugLog('H2', 'apply-rejected-not-pinned-or-cannot-move', {
            pinned,
            canMoveInDirection,
            deltaY,
            prev,
            maxOffset: maxOffsetRef.current,
            containerTop: rect?.top ?? null,
            containerBottom: rect?.bottom ?? null,
            viewportHeight,
            lockThreshold,
            centerDistance,
            pinnedNow,
            previousTop,
            currentTop,
            crossedCenterWindow,
            scrollDirection,
          });
          lastContainerTopRef.current = currentTop;
          return false;
        }
        hijackLockedRef.current = true;
        const snapOffset = rect?.top ?? 0;
        if (Math.abs(snapOffset) > 0.5) {
          window.scrollBy({ top: snapOffset, left: 0, behavior: 'auto' });
          debugLog('H5', 'snap-to-pin-on-lock', {
            snapOffset,
            scrollDirection,
          });
        }
        debugLog('H3', 'hijack-locked', {
          deltaY,
          prev,
          maxOffset: maxOffsetRef.current,
          containerTop: rect?.top ?? null,
          containerBottom: rect?.bottom ?? null,
          viewportHeight,
          lockThreshold,
          centerDistance,
          pinnedNow,
          previousTop,
          currentTop,
          crossedCenterWindow,
          scrollDirection,
        });
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
      debugLog('H3', 'apply-accepted', {
        prev,
        next,
        deltaY,
        changed,
      });
      lastContainerTopRef.current = currentTop;
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
      const primaryDelta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const didHijack = applyHorizontalDelta(primaryDelta);
      debugLog('H2', 'wheel-processed', {
        deltaY: e.deltaY,
        deltaX: e.deltaX,
        primaryDelta,
        didHijack,
      });
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