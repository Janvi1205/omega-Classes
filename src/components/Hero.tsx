import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import studentHero from '@/assets/a-young-indian-girl-standing-outdoors-we_jh0KSG5PQeeiJ58cXUzcAQ_lYNZ7sEySSKJDXFRugAhgw.jpeg';
import Particles from '@/components/ui/particles';
import TextType from '@/components/ui/text-type';
import { memo, useCallback } from 'react';

const Hero = memo(() => {
  const scrollToCourses = useCallback(() => {
    const element = document.querySelector('#batches');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return <section className="min-h-screen hero-gradient flex items-center pt-16 px-4 relative overflow-hidden">
    {/* Particle Background - Reduced particle count for better performance */}
    <div className="absolute inset-0 w-full h-full">
      <Particles
        particleCount={80}
        particleSpread={15}
        speed={0.03}
        particleColors={["#ffffff", "#e0e7ff", "#c7d2fe"]}
        moveParticlesOnHover={false}
        particleHoverFactor={0.5}
        alphaParticles={true}
        particleBaseSize={60}
        sizeRandomness={0.6}
        cameraDistance={25}
        className="opacity-20"
      />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight"
          >
            Excellence in
            <span className="block">
              <TextType
                text={[
                  "Education",
                  "Science",
                  "Mathematics",
                  "Learning",
                  "Success"
                ]}
                className="text-accent font-bold"
                typingSpeed={100}
                deletingSpeed={50}
                pauseDuration={2000}
                cursorCharacter="|"
                cursorClassName="text-accent"
                textColors={["#60a5fa", "#34d399", "#f472b6", "#fbbf24", "#a78bfa"]}
                startOnVisible={true}
                loop={true}
              />
            </span>
          </motion.h1>

          <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 mb-6 sm:mb-8 leading-relaxed">
            Join Omega Pro Classes for comprehensive coaching in Science and Mathematics.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12"
          >
            <button
              onClick={scrollToCourses}
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8"
            >
              Our Courses <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative order-first lg:order-last"
        >
          <div className="relative">
            <img
              src={studentHero}
              alt="Student holding books - Quality education at Omega Pro Classes"
              className="w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl max-h-[400px] sm:max-h-none object-cover"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>;
});

Hero.displayName = 'Hero';

export default Hero;