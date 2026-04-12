import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Ensure testimonials is an array
  const testimonialsArray = Array.isArray(data?.testimonials) ? data.testimonials : [];

  useEffect(() => {
    if (testimonialsArray.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonialsArray.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonialsArray.length, isHovered]);

  if (testimonialsArray.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding border-t border-border/30">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">What They Say</h2>
        <p className="text-muted max-w-lg mx-auto">Hear from our members, alumni, and faculty advisors.</p>
      </div>

      <div 
        className="max-w-3xl mx-auto relative h-[300px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center text-center p-8 glass-panel h-fit"
          >
            <Quote className="w-12 h-12 text-primary/30 mb-6" />
            <p className="text-lg md:text-xl font-medium text-white mb-8 italic">
              "{testimonialsArray[index].quote}"
            </p>
            <div className="flex items-center gap-4">
              <img 
                src={testimonialsArray[index].avatar || '/assets/images/test1.jpg'} 
                alt={testimonialsArray[index].name} 
                className="w-12 h-12 rounded-full border border-border"
                loading="lazy"
              />
              <div className="text-left">
                <h4 className="font-heading font-bold text-white">{testimonialsArray[index].name}</h4>
                <p className="text-sm text-secondary">{testimonialsArray[index].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {testimonialsArray.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-white/30'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
