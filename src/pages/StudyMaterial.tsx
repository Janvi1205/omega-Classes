import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, ArrowLeft, Calculator, Atom, Microscope, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const StudyMaterial: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleContactRedirect = () => {
    navigate("/");
    setTimeout(() => {
      const contactElement = document.getElementById("contact");
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Subject configurations for different sections
  const getSubjectsForClass = (className: string) => {
    if (className.includes("Class 7") || className.includes("Class 8") || 
        className.includes("Class 9") || className.includes("Class 10")) {
      return [
        {
          name: "Mathematics",
          icon: Calculator,
          color: "bg-blue-500",
        },
        {
          name: "Science",
          icon: Atom,
          color: "bg-green-500",
        },
      ];
    } else {
      return [
        {
          name: "Mathematics",
          icon: Calculator,
          color: "bg-blue-500",
        },
        {
          name: "Physics",
          icon: Zap,
          color: "bg-purple-500",
        },
        {
          name: "Chemistry",
          icon: Atom,
          color: "bg-green-500",
        },
        {
          name: "Biology",
          icon: Microscope,
          color: "bg-orange-500",
        },
      ];
    }
  };

  const classes = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
  
  const competitiveExams = [
    {
      name: "IIT Preparation",
      description: "Advanced concepts for JEE Main & Advanced",
      subjects: [
        {
          name: "Mathematics",
          icon: Calculator,
          color: "bg-blue-500",
        },
        {
          name: "Physics",
          icon: Zap,
          color: "bg-purple-500",
        },
        {
          name: "Chemistry",
          icon: Atom,
          color: "bg-green-500",
        },
      ]
    },
    {
      name: "NEET Preparation", 
      description: "Medical entrance exam preparation",
      subjects: [
        {
          name: "Biology",
          icon: Microscope,
          color: "bg-orange-500",
        },
        {
          name: "Chemistry",
          icon: Atom,
          color: "bg-green-500",
        },
        {
          name: "Physics",
          icon: Zap,
          color: "bg-purple-500",
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Gen Z vibes */}
      <section className="pt-20 pb-12 hero-gradient relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="floating-circle w-32 h-32 top-10 right-10 animate-float opacity-20" />
        <div className="floating-square w-20 h-20 bottom-20 left-10 animate-float-slow opacity-15" />
        <div className="floating-circle w-16 h-16 top-1/2 left-1/4 animate-float opacity-25" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-primary-foreground"
          >
            <motion.button
              onClick={handleBackToHome}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full cursor-pointer"
            >
              <ArrowLeft size={20} />
              Back to Home
            </motion.button>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 animate-neon-glow"
            >
              Study Materials ✨
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-primary-foreground/90 max-w-3xl mx-auto"
            >
              Access comprehensive study materials for all classes to enhance your learning journey 🚀
            </motion.p>
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
            <h2 className="text-3xl font-bold text-foreground mb-4">Class-wise Study Materials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your class to access relevant study materials, notes, and practice papers.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* School Classes Section */}
            {classes.map((className, classIndex) => {
              const subjects = getSubjectsForClass(className);
              return (
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

                <div className={`grid gap-4 sm:gap-6 ${subjects.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4'}`}>
                  {subjects.map((subject, index) => {
                    const IconComponent = subject.icon;
                    return (
                      <motion.div
                        key={subject.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: classIndex * 0.1 + index * 0.05,
                        }}
                        whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="genz-card p-4 sm:p-6 cursor-pointer group relative"
                      >
                        <Link
                          to={`/subject/${className.toLowerCase().replace(" ", "-")}/${subject.name.toLowerCase()}`}
                          className="block"
                        >
                           <div className="flex flex-col items-center text-center">
                             <motion.div
                               whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                               transition={{ duration: 0.4 }}
                               className={`${subject.color} text-white p-3 sm:p-4 rounded-full mb-3 sm:mb-4 relative group-hover:animate-bounce-in`}
                             >
                               <IconComponent size={24} className="sm:w-8 sm:h-8" />
                               <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                             </motion.div>
                             <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-lg group-hover:text-primary transition-colors duration-300">
                               {subject.name} 📚
                             </h4>
                           </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
              );
            })}

            {/* Competitive Exams Section */}
            {competitiveExams.map((exam, examIndex) => (
              <motion.div
                key={exam.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (classes.length + examIndex) * 0.1 }}
                className="card-gradient rounded-2xl p-8 border-2 border-primary/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-3 rounded-lg">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{exam.name}</h3>
                    <p className="text-muted-foreground text-sm">{exam.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {exam.subjects.map((subject, index) => {
                    const IconComponent = subject.icon;
                    return (
                      <motion.div
                        key={subject.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: (classes.length + examIndex) * 0.1 + index * 0.05,
                        }}
                        whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="genz-card p-4 sm:p-6 cursor-pointer group relative"
                      >
                        <Link
                          to={`/subject/${exam.name.toLowerCase().replace(" ", "-")}/${subject.name.toLowerCase()}`}
                          className="block"
                        >
                           <div className="flex flex-col items-center text-center">
                             <motion.div
                               whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                               transition={{ duration: 0.4 }}
                               className={`${subject.color} text-white p-3 sm:p-4 rounded-full mb-3 sm:mb-4 relative group-hover:animate-neon-glow`}
                             >
                               <IconComponent size={24} className="sm:w-8 sm:h-8" />
                               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                             </motion.div>
                             <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-lg group-hover:text-primary transition-colors duration-300">
                               {subject.name} 🎯
                             </h4>
                           </div>
                        </Link>
                      </motion.div>
                    );
                  })}
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
              <h3 className="text-2xl font-bold text-foreground mb-4">Need More Resources?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Contact us for additional study materials or specific topic resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleContactRedirect} className="btn-primary">
                  Contact Us
                </button>
                <button onClick={handleBackToHome} className="btn-secondary">
                  Back to Home
                </button>
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
