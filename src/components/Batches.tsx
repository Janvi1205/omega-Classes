import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Clock, Users, CheckCircle } from 'lucide-react';

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
      description: 'Building strong foundations for future success',
      subjects: ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology'],
      features: [
        'Interactive Learning Sessions',
        'Regular Assessments',
        'Doubt Clearing Sessions',
        'Study Material Provided'
      ],
      timing: 'Morning & Evening Batches Available',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'foundation',
      title: 'Foundation Batch',
      subtitle: 'Classes 11-12',
      description: 'Advanced preparation for competitive exams',
      subjects: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Biology'],
      features: [
        'JEE/NEET Preparation',
        'Board Exam Excellence',
        'Mock Tests & Analysis',
        'Personal Mentoring'
      ],
      timing: 'Morning & Evening Batches Available',
      color: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <section id="batches" className="py-20 bg-secondary/50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Course Batches
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect batch for your academic journey with expert guidance and comprehensive curriculum
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {batches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 100 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="card-gradient rounded-2xl p-8 relative overflow-hidden group"
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${batch.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {batch.title}
                    </h3>
                    <p className="text-primary font-semibold text-lg">
                      {batch.subtitle}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      {batch.description}
                    </p>
                  </div>
                  <BookOpen className="text-primary" size={32} />
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
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
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
                  className="btn-primary w-full"
                >
                  Register Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Batches;