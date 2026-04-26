import React, { useRef } from 'react';
import { useData } from '../../hooks/useData';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Code2, Cpu, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const iconMap: Record<string, React.FC<any>> = { Code2, Cpu, Globe, Zap };

const ComplexKnot = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle core rotation
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.1;
      
      // Fluid mouse tracking
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      
      meshRef.current.rotation.y += 0.05 * (targetX - meshRef.current.rotation.y);
      meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        {/* Outer Glass layer */}
        <TorusKnot args={[1.5, 0.4, 256, 64]}>
          <MeshDistortMaterial 
            color="#9d4edd" 
            distort={0.4} 
            speed={2} 
            roughness={0.1}
            metalness={0.8}
            transparent 
            opacity={0.3}
          />
        </TorusKnot>

        {/* Inner Emissive Core for Bloom */}
        <TorusKnot args={[1.4, 0.2, 128, 32]}>
          <meshBasicMaterial color="#00f5d4" toneMapped={false} />
        </TorusKnot>
      </Float>
    </group>
  );
};

const About = () => {
  const { data } = useData();
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  if (!data?.about) return null;
  const { description, pillars } = data.about;

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section id="about" className="py-32 relative text-text">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Beyond standard <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">development.</span>
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8 max-w-xl">
              {description}
            </p>
            
            <motion.div 
              ref={ref as any}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {pillars.map((pillar, idx) => {
                const IconComponent = iconMap[pillar.icon] || Code2;
                return (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    className="glass-panel p-6 border-l-2 hover:bg-white/5 transition-colors"
                    style={{ borderLeftColor: idx % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)' }}
                  >
                    <IconComponent className="w-8 h-8 text-secondary mb-4" />
                    <h3 className="font-heading font-bold text-xl mb-2">{pillar.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{pillar.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 h-[500px] relative">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2} />
              <pointLight position={[-10, -10, -5]} color="#9d4edd" intensity={5} />
              <ComplexKnot />
              <EffectComposer>
                <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2.0} />
              </EffectComposer>
            </Canvas>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;
