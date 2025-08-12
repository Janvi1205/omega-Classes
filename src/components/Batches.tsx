import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Clock, Users, CheckCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface BatchesProps {
  onRegisterClick: (batchType: string) => void;
}

const Batches = ({ onRegisterClick }: BatchesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const batches = [
    {
      id: 'nurture',
      title: 'Nurture Batch',
      subtitle: 'Classes 7-10',
      description: 'Mastering the basics for advanced learning',
      subjects: ['Mathematics', 'Science'],
      features: [
        'Interactive Learning Sessions',
        'Regular Assessments',
        'Doubt Clearing Sessions',
        
      ],
      timing: 'Morning & Evening Batches Available',
      color: 'from-primary to-accent'
    },
    {
      id: 'foundation',
      title: 'Foundation Batch',
      subtitle: 'Classes 11-12',
      description: 'Foundation Building for competitive exams',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      features: [
        'JEE/NEET Foundation Building',
        'Board Exam Excellence',
        'Mock Tests & Analysis',
        
      ],
      timing: 'Morning & Evening Batches Available',
      color: 'from-accent to-primary'
    },
    {
      id: 'Ranker',
      title: 'Rankers Batch',
      subtitle: 'JEE/NEET',
      description: 'Strong Concept & Problem-Solving Mastery for JEE/NEET',
      subjects: ['Mathematics/Biology', 'Physics', 'Chemistry'],
      features: [
        'JEE/NEET Preparation',
        'Doubt-Solving & Revision Sessions',
        'Mock Tests & Analysis',
        
      ],
      timing: 'Morning & Evening Batches Available',
      color: 'from-accent to-primary'
    }
  ];

  return (
    <section id="batches" className="py-20 bg-secondary/50 relative overflow-hidden" ref={ref}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="floating-circle w-40 h-40 top-10 right-10 animate-float opacity-10" />
        <div className="floating-square w-24 h-24 bottom-20 left-10 animate-float-slow opacity-5" />
        <div className="floating-circle w-16 h-16 top-1/2 left-1/3 animate-float opacity-15" style={{ animationDelay: '3s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Course Batches
          </h2>
          <p className="text-xl text-gray-900 dark:text-blue-200 max-w-3xl mx-auto">
            Choose the perfect batch for your academic journey with expert guidance and comprehensive curriculum
          </p>
        </motion.div>

        <Carousel className="w-full mx-auto px-4 sm:px-0">
          <CarouselContent className="ml-0 sm:-ml-2 md:-ml-4">
            {batches.map((batch, index) => (
              <CarouselItem key={batch.id} className="pl-0 sm:pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -10,
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="card-gradient rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden group h-full border border-white/10 hover:border-primary/30 transition-all duration-500"
                >
                  {/* Enhanced background decoration with animation */}
                  <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br ${batch.color} opacity-20 rounded-full blur-2xl sm:blur-3xl group-hover:opacity-40 transition-all duration-500 animate-float`} />
                  <div className={`absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-tr ${batch.color} opacity-10 rounded-full blur-xl sm:blur-2xl group-hover:opacity-25 transition-all duration-500 animate-float-slow`} />
                  <div className="absolute inset-0 animate-shimmer group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
                      <div className="mb-3 sm:mb-0">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                          {batch.title}
                        </h3>
                        <p className="text-primary font-semibold text-base sm:text-lg">
                          {batch.subtitle}
                        </p>
                        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                          {batch.description}
                        </p>
                      </div>
                      <BookOpen className="text-primary flex-shrink-0" size={24} />
                    </div>

                    {/* Subjects */}
                    <div className="mb-4 sm:mb-6">
                       <h4 className="font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                         <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
                         Subjects Covered
                       </h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {batch.subjects.map((subject) => (
                      <span
                            key={subject}
                            className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold border border-primary/30 hover:scale-105 transition-transform cursor-default"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4 sm:mb-6 flex-grow">
                       <h4 className="font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                         <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                         Key Features
                       </h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {batch.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base">
                            <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timing */}
                    <div className="mb-6 sm:mb-8">
                      <p className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base">
                        <Clock size={16} className="sm:w-[18px] sm:h-[18px] text-primary" />
                        {batch.timing}
                      </p>
                    </div>

                    {/* Register Button */}
                    <motion.button
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRegisterClick(batch.title)}
                      className="btn-primary w-full mt-auto text-sm sm:text-base py-2 sm:py-3 relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10">Register Now</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    </motion.button>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-8 sm:-left-10 lg:-left-12 xl:-left-16 h-8 w-8 sm:h-10 sm:w-10" />
          <CarouselNext className="hidden sm:flex -right-8 sm:-right-10 lg:-right-12 xl:-right-16 h-8 w-8 sm:h-10 sm:w-10" />
        </Carousel>
        
        {/* Mobile swipe instruction */}
        <div className="sm:hidden text-center mt-4">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <span>Swipe left for more batches</span>
            <span className="text-primary">→</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Batches;