import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download, FileText, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const StudyMaterial = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const materials = {
    'Class 7': [
      { title: 'Mathematics - Algebra Basics', type: 'PDF', size: '2.3 MB', downloadUrl: '#' },
      { title: 'Science - Living and Non-living', type: 'PDF', size: '1.8 MB', downloadUrl: '#' },
      { title: 'Mathematics - Geometry Introduction', type: 'PDF', size: '3.1 MB', downloadUrl: '#' }
    ],
    'Class 8': [
      { title: 'Mathematics - Linear Equations', type: 'PDF', size: '2.7 MB', downloadUrl: '#' },
      { title: 'Science - Force and Pressure', type: 'PDF', size: '2.2 MB', downloadUrl: '#' },
      { title: 'Science - Light and Sound', type: 'PDF', size: '3.5 MB', downloadUrl: '#' }
    ],
    'Class 9': [
      { title: 'Mathematics - Polynomials', type: 'PDF', size: '2.9 MB', downloadUrl: '#' },
      { title: 'Physics - Motion and Laws', type: 'PDF', size: '3.2 MB', downloadUrl: '#' },
      { title: 'Chemistry - Atoms and Molecules', type: 'PDF', size: '2.6 MB', downloadUrl: '#' },
      { title: 'Biology - Life Processes', type: 'PDF', size: '3.8 MB', downloadUrl: '#' }
    ],
    'Class 10': [
      { title: 'Mathematics - Quadratic Equations', type: 'PDF', size: '3.1 MB', downloadUrl: '#' },
      { title: 'Physics - Electricity and Magnetism', type: 'PDF', size: '4.2 MB', downloadUrl: '#' },
      { title: 'Chemistry - Carbon Compounds', type: 'PDF', size: '3.7 MB', downloadUrl: '#' },
      { title: 'Biology - Heredity and Evolution', type: 'PDF', size: '3.4 MB', downloadUrl: '#' }
    ],
    'Class 11': [
      { title: 'Mathematics - Trigonometry', type: 'PDF', size: '4.1 MB', downloadUrl: '#' },
      { title: 'Physics - Mechanics', type: 'PDF', size: '5.3 MB', downloadUrl: '#' },
      { title: 'Chemistry - Organic Chemistry Basics', type: 'PDF', size: '4.8 MB', downloadUrl: '#' },
      { title: 'Biology - Plant Kingdom', type: 'PDF', size: '4.5 MB', downloadUrl: '#' }
    ],
    'Class 12': [
      { title: 'Mathematics - Calculus', type: 'PDF', size: '5.2 MB', downloadUrl: '#' },
      { title: 'Physics - Electromagnetic Induction', type: 'PDF', size: '4.9 MB', downloadUrl: '#' },
      { title: 'Chemistry - Chemical Kinetics', type: 'PDF', size: '4.3 MB', downloadUrl: '#' },
      { title: 'Biology - Biotechnology', type: 'PDF', size: '5.1 MB', downloadUrl: '#' }
    ]
  };

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
              to="/"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Study Materials
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Access comprehensive study materials for all classes. Download PDFs, 
              practice papers, and additional resources to enhance your learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Study Materials */}
      <section className="py-20" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Class-wise Study Materials
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your class to access relevant study materials, notes, and practice papers.
            </p>
          </motion.div>

          <div className="space-y-12">
            {Object.entries(materials).map(([className, classContent], classIndex) => (
              <motion.div
                key={className}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: classIndex * 0.1 }}
                className="card-gradient rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{className}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classContent.map((material, index) => (
                    <motion.div
                      key={material.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: classIndex * 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2 leading-tight">
                            {material.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText size={14} />
                              {material.type}
                            </span>
                            <span>{material.size}</span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                        onClick={() => {
                          // In a real app, this would trigger the download
                          console.log(`Downloading: ${material.title}`);
                        }}
                      >
                        <Download size={16} />
                        Download
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="card-gradient rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Need More Resources?
              </h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Contact us for additional study materials 
                or specific topic resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#contact" className="btn-primary">
                  Contact Us
                </Link>
                <Link to="/" className="btn-secondary">
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudyMaterial;