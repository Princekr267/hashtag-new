import React, { useEffect, useState } from 'react';
import { useData } from '../hooks/useData';
import { useInView } from '../hooks/useInView';

interface CounterProps {
  target: number;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState<number>(0);
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      setCount(Math.floor(easeProgress * target));

      if (percentage < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
};

const StatsBanner: React.FC = () => {
  const { data } = useData();
  
  if (!data?.society) return null;
  const { members, projects, events, founded } = data.society;
  
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - parseInt(founded);

  return (
    <section className="relative -mt-16 z-20 pb-20 px-6 md:px-12 w-full max-w-[1200px] mx-auto">
      <div className="glass-panel py-8 px-6 md:px-12 flex flex-wrap justify-between gap-8 md:gap-4 divide-x-0 md:divide-x divide-border">
        
        <div className="flex-1 flex flex-col items-center justify-center min-w-[120px] pb-4 md:pb-0 group cursor-default transition-all duration-300">
          <div className="font-heading font-bold text-4xl md:text-5xl text-white mb-2 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-primary will-change-transform inline-block">
            <Counter target={members} /><span className="inline-block transition-transform group-hover:scale-110">+</span>
          </div>
          <p className="text-muted text-sm font-medium uppercase tracking-wider transition-all duration-300 ease-out group-hover:scale-105 will-change-transform inline-block">Members</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center min-w-[120px] pb-4 md:pb-0 border-t border-border/50 md:border-t-0 pt-4 md:pt-0 pl-0 md:pl-4 group cursor-default transition-all duration-300">
          <div className="font-heading font-bold text-4xl md:text-5xl text-white mb-2 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-primary will-change-transform inline-block">
            <Counter target={projects} /><span className="inline-block transition-transform group-hover:scale-110">+</span>
          </div>
          <p className="text-muted text-sm font-medium uppercase tracking-wider transition-all duration-300 ease-out group-hover:scale-105 will-change-transform inline-block">Projects built</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center min-w-[120px] pb-4 md:pb-0 border-t border-border/50 md:border-t-0 pt-4 md:pt-0 pl-0 md:pl-4 group cursor-default transition-all duration-300">
          <div className="font-heading font-bold text-4xl md:text-5xl text-white mb-2 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-primary will-change-transform inline-block">
            <Counter target={events} /><span className="inline-block transition-transform group-hover:scale-110">+</span>
          </div>
          <p className="text-muted text-sm font-medium uppercase tracking-wider transition-all duration-300 ease-out group-hover:scale-105 will-change-transform inline-block">Events hosted</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center min-w-[120px] border-t border-border/50 md:border-t-0 pt-4 md:pt-0 pl-0 md:pl-4 group cursor-default transition-all duration-300">
          <div className="font-heading font-bold text-4xl md:text-5xl text-white mb-2 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-primary will-change-transform inline-block">
            <Counter target={yearsActive} />
          </div>
          <p className="text-muted text-sm font-medium uppercase tracking-wider transition-all duration-300 ease-out group-hover:scale-105 will-change-transform inline-block">Years Active</p>
        </div>

      </div>
    </section>
  );
};

export default StatsBanner;
