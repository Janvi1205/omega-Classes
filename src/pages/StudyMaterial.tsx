import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, ArrowLeft, Calculator, Atom, Microscope, Zap, GraduationCap, Award } from "lucide-react";
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

      {/* Hero Section */}
      <section className="pt-20 pb-12 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-primary-foreground"
          >
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors bg-transparent border-none cursor-pointer"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Study Materials</h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Access comprehensive study materials for all classes to enhance your learning.
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
            <h2 className="text-3xl font-bold text-foreground mb-4">Class-wise Study Materials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your class to access relevant study materials, notes, and practice papers.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* School Classes Section */}
            {classes.map((className, classIndex) => {
              const subjects = getSubjectsForClass(className);
              const subjectCards = subjects.map((subject, index) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: (classIndex * 0.1) + (index * 0.1) }}
                  className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 relative overflow-hidden"
                  onClick={() => navigate(`/subject/${className.toLowerCase().replace(" ", "-")}/${subject.name.toLowerCase()}`)}
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)"
                  }}
                >
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className={`${subject.color} text-white p-4 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300`}>
                      <subject.icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{subject.name}</h3>
                    <p className="text-muted-foreground">
                      Comprehensive study materials, notes, and practice questions for {subject.name}.
                    </p>
                  </div>
                  
                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse" />
                  </div>
                </motion.div>
              ));

              return (
                <motion.div
                  key={className}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: classIndex * 0.1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg">
                      <BookOpen size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{className}</h3>
                      <p className="text-muted-foreground">Interactive study materials and practice resources</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjectCards}
                  </div>
                </motion.div>
              );
            })}

            {/* Competitive Exams Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: classes.length * 0.1 }}
              className="space-y-12"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4 rounded-xl shadow-lg">
                    <Award size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground">Competitive Exam Preparation</h3>
                    <p className="text-muted-foreground">Advanced preparation for JEE, NEET and other competitive exams</p>
                  </div>
                </div>
              </div>

              {competitiveExams.map((exam, examIndex) => {
                const examSubjectCards = exam.subjects.map((subject, index) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: (classes.length + examIndex + 1) * 0.1 + (index * 0.1) }}
                    className="bg-gradient-to-br from-orange-500/10 to-red-500/10 text-card-foreground rounded-xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 relative overflow-hidden"
                    onClick={() => navigate(`/subject/${exam.name.toLowerCase().replace(" ", "-")}/${subject.name.toLowerCase()}`)}
                  >
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className={`${subject.color} text-white p-4 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300`}>
                        <subject.icon size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{subject.name}</h3>
                      <p className="text-muted-foreground">
                        {exam.description} - Advanced {subject.name} concepts and problem solving.
                      </p>
                    </div>
                    
                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent animate-pulse" />
                    </div>
                  </motion.div>
                ));

                return (
                  <motion.div
                    key={exam.name}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: (classes.length + examIndex + 1) * 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl shadow-lg">
                        <GraduationCap size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{exam.name}</h4>
                        <p className="text-muted-foreground">{exam.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {examSubjectCards}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-background to-accent/5 rounded-3xl p-12 border border-border shadow-lg">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold text-foreground mb-6">Need More Resources? 📚</h3>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Can't find what you're looking for? Our team is here to help you with additional study materials, personalized guidance, or specific topic resources tailored to your learning needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    onClick={handleContactRedirect} 
                    className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Help Now ✨
                  </motion.button>
                  <motion.button 
                    onClick={handleBackToHome} 
                    className="btn-secondary text-lg px-8 py-4 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back to Home 🏠
                  </motion.button>
                </div>
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
