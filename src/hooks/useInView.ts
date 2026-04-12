import { useState, useEffect, useRef, MutableRefObject } from 'react';

export interface UseInViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useInView(options: UseInViewOptions = { threshold: 0.1, triggerOnce: true }) {
  const [isInView, setIsInView] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | HTMLSpanElement | null>(null) as MutableRefObject<any>;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      } else if (!options.triggerOnce) {
        setIsInView(false);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options.threshold, options.triggerOnce]);

  return { ref, isInView };
}
