import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, FileText, BookOpen, ArrowLeft, Calculator, Atom, Microscope, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SubjectNotes = () => {
  const { className, subject } = useParams();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getSubjectIcon = (subjectName: string) => {
    switch (subjectName?.toLowerCase()) {
      case 'mathematics':
        return Calculator;
      case 'physics':
        return Zap;
      case 'chemistry':
        return Atom;
      case 'biology':
        return Microscope;
      default:
        return BookOpen;
    }
  };

  const getSubjectColor = (subjectName: string) => {
    switch (subjectName?.toLowerCase()) {
      case 'mathematics':
        return 'bg-blue-500';
      case 'physics':
        return 'bg-purple-500';
      case 'chemistry':
        return 'bg-green-500';
      case 'biology':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  // Sample chapter data - in real app this would come from API/database
  const chapters = {
    mathematics: {
      'class-7': [
        { title: 'Algebra Basics', notes: 15, exercises: 25, size: '2.3 MB' },
        { title: 'Geometry Introduction', notes: 12, exercises: 18, size: '1.8 MB' },
        { title: 'Fractions and Decimals', notes: 10, exercises: 20, size: '1.5 MB' },
        { title: 'Simple Equations', notes: 8, exercises: 15, size: '1.2 MB' }
      ],
      'class-8': [
        { title: 'Linear Equations', notes: 18, exercises: 30, size: '2.7 MB' },
        { title: 'Understanding Quadrilaterals', notes: 14, exercises: 22, size: '2.1 MB' },
        { title: 'Data Handling', notes: 12, exercises: 20, size: '1.9 MB' },
        { title: 'Squares and Square Roots', notes: 16, exercises: 25, size: '2.4 MB' }
      ],
      'class-9': [
        { title: 'Polynomials', notes: 20, exercises: 35, size: '2.9 MB' },
        { title: 'Coordinate Geometry', notes: 18, exercises: 28, size: '2.6 MB' },
        { title: 'Linear Equations in Two Variables', notes: 16, exercises: 30, size: '2.3 MB' },
        { title: 'Introduction to Euclid\'s Geometry', notes: 14, exercises: 20, size: '2.0 MB' }
      ],
      'class-10': [
        { title: 'Quadratic Equations', notes: 22, exercises: 40, size: '3.1 MB' },
        { title: 'Arithmetic Progressions', notes: 18, exercises: 32, size: '2.7 MB' },
        { title: 'Triangles', notes: 20, exercises: 35, size: '2.9 MB' },
        { title: 'Introduction to Trigonometry', notes: 24, exercises: 45, size: '3.3 MB' }
      ]
    },
    physics: {
      'class-9': [
        { title: 'Motion and Laws', notes: 16, exercises: 25, size: '3.2 MB' },
        { title: 'Force and Laws of Motion', notes: 18, exercises: 28, size: '3.5 MB' },
        { title: 'Gravitation', notes: 14, exercises: 22, size: '2.8 MB' },
        { title: 'Work and Energy', notes: 20, exercises: 30, size: '3.7 MB' }
      ],
      'class-10': [
        { title: 'Light - Reflection and Refraction', notes: 22, exercises: 35, size: '4.2 MB' },
        { title: 'Electricity', notes: 24, exercises: 40, size: '4.5 MB' },
        { title: 'Magnetic Effects of Electric Current', notes: 18, exercises: 28, size: '3.8 MB' },
        { title: 'Our Environment', notes: 16, exercises: 25, size: '3.2 MB' }
      ]
    },
    chemistry: {
      'class-9': [
        { title: 'Matter in Our Surroundings', notes: 14, exercises: 20, size: '2.6 MB' },
        { title: 'Is Matter Around Us Pure', notes: 16, exercises: 25, size: '2.9 MB' },
        { title: 'Atoms and Molecules', notes: 18, exercises: 30, size: '3.2 MB' },
        { title: 'Structure of the Atom', notes: 20, exercises: 32, size: '3.5 MB' }
      ],
      'class-10': [
        { title: 'Acids, Bases and Salts', notes: 20, exercises: 35, size: '3.7 MB' },
        { title: 'Metals and Non-metals', notes: 18, exercises: 30, size: '3.4 MB' },
        { title: 'Carbon and its Compounds', notes: 24, exercises: 40, size: '4.1 MB' },
        { title: 'Life Processes', notes: 22, exercises: 38, size: '3.9 MB' }
      ]
    },
    biology: {
      'class-9': [
        { title: 'The Fundamental Unit of Life', notes: 16, exercises: 22, size: '3.8 MB' },
        { title: 'Tissues', notes: 14, exercises: 20, size: '3.2 MB' },
        { title: 'Diversity in Living Organisms', notes: 20, exercises: 28, size: '4.2 MB' },
        { title: 'Why Do We Fall Ill', notes: 18, exercises: 25, size: '3.6 MB' }
      ],
      'class-10': [
        { title: 'Life Processes', notes: 22, exercises: 35, size: '4.5 MB' },
        { title: 'Control and Coordination', notes: 20, exercises: 30, size: '4.1 MB' },
        { title: 'How Do Organisms Reproduce?', notes: 24, exercises: 38, size: '4.8 MB' },
        { title: 'Heredity and Evolution', notes: 18, exercises: 28, size: '3.9 MB' }
      ]
    }
  };

  const currentChapters = chapters[subject?.toLowerCase() as keyof typeof chapters]?.[className?.toLowerCase().replace(' ', '-') as string] || [];
  const IconComponent = getSubjectIcon(subject || '');
  const subjectColor = getSubjectColor(subject || '');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-primary-foreground"
          >
            <Link
              to="/study-material"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Study Materials
            </Link>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className={`${subjectColor} text-white p-3 rounded-lg`}>
                <IconComponent size={32} />
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold">
                  {subject}
                </h1>
                <p className="text-xl text-primary-foreground/90 capitalize">
                  {className?.replace('-', ' ')} Notes
                </p>
              </div>
            </div>
            <p className="text-lg text-primary-foreground/90 max-w-3xl mx-auto">
              Chapter-wise notes, exercises, and study materials for comprehensive learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chapter Notes */}
      <section className="py-20" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Chapter-wise Notes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive notes and practice exercises for each chapter.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentChapters.map((chapter, index) => (
              <motion.div
                key={chapter.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="card-gradient rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-3 text-lg leading-tight">
                      {chapter.title}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText size={14} />
                        <span>{chapter.notes} Notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} />
                        <span>{chapter.exercises} Exercises</span>
                      </div>
                      <div className="text-xs">
                        Size: {chapter.size}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                    onClick={() => {
                      console.log(`Downloading notes: ${chapter.title}`);
                    }}
                  >
                    <Download size={16} />
                    Download Notes
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-secondary text-secondary-foreground py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
                    onClick={() => {
                      console.log(`Downloading exercises: ${chapter.title}`);
                    }}
                  >
                    <Download size={16} />
                    Download Exercises
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {currentChapters.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <div className="card-gradient rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Coming Soon!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Notes for {subject} {className?.replace('-', ' ')} are being prepared. 
                  Check back soon or contact us for updates.
                </p>
                <Link to="/study-material" className="btn-primary">
                  Browse Other Subjects
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubjectNotes;