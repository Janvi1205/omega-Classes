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
  return <section className="min-h-screen hero-gradient flex items-center pt-16 px-4 relative overflow-hidden">
      {/* Floating elements */}
      <div className="floating-circle w-32 h-32 top-20 left-10 animate-float" />
      <div className="floating-circle w-20 h-20 top-1/3 right-20 animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="floating-square w-16 h-16 bottom-1/4 left-1/4 animate-float" style={{ animationDelay: '4s' }} />
      <div className="floating-square w-12 h-12 top-1/2 right-1/3 animate-float-slow" style={{ animationDelay: '1s' }} />
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative z-10">
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
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 animate-pulse-glow hover:animate-none transition-all duration-300 group"
              >
                Our Courses 
                <ArrowRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
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
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl sm:rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse-glow" />
              <img 
                src={studentHero} 
                alt="Student holding books - Quality education at Omega Pro Classes" 
                className="relative w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl max-h-[400px] sm:max-h-none object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default Hero;