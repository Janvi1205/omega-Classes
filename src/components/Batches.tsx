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
    <section id="batches" className="py-20 bg-secondary/50" ref={ref}>
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

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent className="-ml-2 md:-ml-4">
            {batches.map((batch, index) => (
              <CarouselItem key={batch.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                <div className="h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="card-gradient rounded-2xl p-6 sm:p-8 relative overflow-hidden group h-full"
                  >
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${batch.color} opacity-20 rounded-full blur-3xl group-hover:opacity-40 transition-all duration-500`} />
                    <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${batch.color} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-all duration-500`} />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                            {batch.title}
                          </h3>
                          <p className="text-primary font-semibold text-lg">
                            {batch.subtitle}
                          </p>
                          <p className="text-muted-foreground mt-2">
                            {batch.description}
                          </p>
                        </div>
                        <BookOpen className="text-primary flex-shrink-0" size={28} />
                      </div>

                      {/* Subjects */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <BookOpen size={18} />
                          Subjects Covered
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {batch.subjects.map((subject) => (
                        <span
                              key={subject}
                              className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/30 hover:scale-105 transition-transform cursor-default"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6 flex-grow">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <CheckCircle size={18} />
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {batch.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Timing */}
                      <div className="mb-8">
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Clock size={18} className="text-primary" />
                          {batch.timing}
                        </p>
                      </div>

                      {/* Register Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onRegisterClick(batch.title)}
                        className="btn-primary w-full mt-auto"
                      >
                        Register Now
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default Batches;