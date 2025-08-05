import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Trophy } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen hero-gradient flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              className="text-4xl md:text-6xl font-black text-primary-foreground mb-6 matte-text"
            >
              Excellence in
              <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-black">Education</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-primary-foreground/90 mb-8 leading-relaxed"
            >
              Join Omega Pro Classes for comprehensive coaching in Science and Mathematics. 
              Empowering students from Class 7 to 12 with expert guidance and proven results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button className="btn-primary flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </button>
              <button className="btn-secondary">
                Learn More
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="text-primary-foreground" size={24} />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">500+</div>
                <div className="text-primary-foreground/80 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <BookOpen className="text-primary-foreground" size={24} />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">6</div>
                <div className="text-primary-foreground/80 text-sm">Subjects</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Trophy className="text-primary-foreground" size={24} />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">95%</div>
                <div className="text-primary-foreground/80 text-sm">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative matte-border backdrop-blur-sm p-8 soft-glow">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <BookOpen size={80} className="mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl font-bold matte-text">Quality Education</h3>
                  <p className="text-primary-foreground/80">Expert Faculty & Modern Teaching</p>
                </div>
              </div>
              
              {/* Floating cards */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-accent to-primary rounded-xl p-4 shadow-lg soft-glow"
              >
                <div className="text-white text-sm font-bold">🔥 Live Classes</div>
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-primary to-accent rounded-xl p-4 shadow-lg soft-glow"
              >
                <div className="text-white text-sm font-bold">⚡ Expert Doubt Solving</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;