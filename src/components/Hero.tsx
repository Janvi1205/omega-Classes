import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import studentHero from '@/assets/student-hero.jpg';
const Hero = () => {
  const scrollToCourses = () => {
    const element = document.querySelector('#batches');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return <section className="min-h-screen hero-gradient flex items-center pt-16 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }}>
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="text-3xl sm:text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Excellence in
              <span className="block text-accent">Education</span>
            </motion.h1>
            
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.4
          }} className="text-lg sm:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Join Omega Pro Classes for comprehensive coaching in Science and Mathematics. 
              Empowering students from Class 7 to 12 with expert guidance and proven results.
            </motion.p>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.6
          }} className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={scrollToCourses}
                className="btn-primary flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </button>
              
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }} className="relative">
            <div className="relative">
              <img 
                src={studentHero} 
                alt="Student holding books - Quality education at Omega Pro Classes" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default Hero;