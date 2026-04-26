import React from 'react';
import { useData } from '../../hooks/useData';
import { ExternalLink } from 'lucide-react';
import { Github } from '../Icons';
import { motion } from 'framer-motion';

const Projects = () => {
  const { data } = useData();
  if (!data?.projects) return null;

  // Ensure projects is an array
  const projectsArray = Array.isArray(data.projects) ? data.projects : [];
  if (projectsArray.length === 0) return null;

  return (
    <section id="projects" className="section-padding relative">
      <div className="text-center mb-12 sm:mb-16 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-3 sm:mb-4">Featured Work</h2>
        <p className="text-sm sm:text-base text-muted max-w-lg mx-auto">A quick glance at some of the amazing projects we've built.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[280px] sm:auto-rows-[300px]">
        {projectsArray.map((project, i) => {
          const isLarge = project.featured && i % 3 === 0;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative rounded-xl sm:rounded-2xl overflow-hidden card-surface ${isLarge ? 'md:col-span-2 lg:col-span-2 md:row-span-2' : ''}`}
            >
              {/* Background Image */}
              <img 
                src={project.image || `/assets/images/project${project.id}.jpg`} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-surface/80 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/5 border border-white/10 rounded-full font-mono text-secondary blur-0" style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)' }}>
                      {t}
                    </span>
                  ))}
                </div>
                
                <h3 className="font-heading font-bold text-white mb-2 group-hover:-translate-y-2 transition-transform duration-300 line-clamp-2" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}>
                  {project.title}
                </h3>
                
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-2 transition-all duration-300 overflow-hidden">
                  <p className="text-muted mb-3 sm:mb-4 line-clamp-2 md:line-clamp-none text-xs sm:text-sm">{project.description}</p>
                  <div className="flex gap-3 sm:gap-4">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white hover:text-primary transition-colors">
                        <Github className="w-4 h-4" /> Source
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white hover:text-secondary transition-colors">
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
