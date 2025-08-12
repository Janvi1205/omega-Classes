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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
          }} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
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
          }} className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 mb-6 sm:mb-8 leading-relaxed">
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
          }} className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12">
              <button 
                onClick={scrollToCourses}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8"
              >
                Our Courses <ArrowRight size={18} className="sm:w-5 sm:h-5" />
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
        }} className="relative order-first lg:order-last">
            <div className="relative floating">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl sm:rounded-2xl blur-xl"></div>
              <img 
                src={studentHero} 
                alt="Student holding books - Quality education at Omega Pro Classes" 
                className="relative w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl max-h-[400px] sm:max-h-none object-cover black-matte-animation"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/5 rounded-xl sm:rounded-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default Hero;