import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const isReducedMotion = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

export interface SplitTextOptions {
  duration?: number;
  ease?: string;
  stagger?: number;
  delay?: number;
}

// Generic Text Split and Stagger Function
export const animateSplitText = (textRef: React.RefObject<HTMLElement | null>, options: SplitTextOptions = {}) => {
  if (isReducedMotion() || !textRef.current) return;

  const container = textRef.current;
  const originalText = container.innerText;
  
  container.innerHTML = originalText
    .split('')
    .map((char: string) => {
      if (char === ' ') return '<span>&nbsp;</span>';
      return `<span class="inline-block opacity-0 translate-y-4">${char}</span>`;
    })
    .join('');

  const chars = container.querySelectorAll('span');

  return gsap.to(chars, {
    y: 0,
    opacity: 1,
    duration: options.duration || 0.8,
    ease: options.ease || 'power3.out',
    stagger: options.stagger || 0.03,
    delay: options.delay || 0
  });
};
