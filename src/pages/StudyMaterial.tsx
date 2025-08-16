import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, ArrowLeft, Calculator, Atom, Microscope, Zap, Sparkles, Target, Trophy, Star } from "lucide-react";
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
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
          description: "Algebra, Geometry & Trigonometry",
          topics: ["Algebra", "Geometry", "Trigonometry"]
        },
        {
          name: "Science",
          icon: Atom,
          color: "bg-gradient-to-br from-green-500 to-green-600",
          description: "Physics, Chemistry & Biology",
          topics: ["Physics", "Chemistry", "Biology"]
        },
      ];
    } else {
      return [
        {
          name: "Mathematics",
          icon: Calculator,
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
          description: "Advanced Calculus & Algebra",
          topics: ["Calculus", "Algebra", "Statistics"]
        },
        {
          name: "Physics",
          icon: Zap,
          color: "bg-gradient-to-br from-purple-500 to-purple-600",
          description: "Mechanics, Electricity & Optics",
          topics: ["Mechanics", "Electricity", "Optics"]
        },
        {
          name: "Chemistry",
          icon: Atom,
          color: "bg-gradient-to-br from-green-500 to-green-600",
          description: "Organic, Inorganic & Physical",
          topics: ["Organic", "Inorganic", "Physical"]
        },
        {
          name: "Biology",
          icon: Microscope,
          color: "bg-gradient-to-br from-orange-500 to-orange-600",
          description: "Cell Biology & Genetics",
          topics: ["Cell Biology", "Genetics", "Ecology"]
        },
      ];
    }
  };

  const classes = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
  
  const competitiveExams = [
    {
      name: "IIT Preparation",
      description: "Advanced concepts for JEE Main & Advanced",
      badge: "Premium",
      icon: Target,
      subjects: [
        {
          name: "Mathematics",
          icon: Calculator,
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
          description: "Advanced Calculus & Algebra",
          topics: ["Calculus", "Algebra", "Statistics"]
        },
        {
          name: "Physics",
          icon: Zap,
          color: "bg-gradient-to-br from-purple-500 to-purple-600",
          description: "Mechanics, Electricity & Optics",
          topics: ["Mechanics", "Electricity", "Optics"]
        },
        {
          name: "Chemistry",
          icon: Atom,
          color: "bg-gradient-to-br from-green-500 to-green-600",
          description: "Organic, Inorganic & Physical",
          topics: ["Organic", "Inorganic", "Physical"]
        },
      ]
    },
    {
      name: "NEET Preparation", 
      description: "Medical entrance exam preparation",
      badge: "Premium",
      icon: Trophy,
      subjects: [
        {
          name: "Biology",
          icon: Microscope,
          color: "bg-gradient-to-br from-orange-500 to-orange-600",
          description: "Cell Biology & Genetics",
          topics: ["Cell Biology", "Genetics", "Ecology"]
        },
        {
          name: "Chemistry",
          icon: Atom,
          color: "bg-gradient-to-br from-green-500 to-green-600",
          description: "Organic, Inorganic & Physical",
          topics: ["Organic", "Inorganic", "Physical"]
        },
        {
          name: "Physics",
          icon: Zap,
          color: "bg-gradient-to-br from-purple-500 to-purple-600",
          description: "Mechanics, Electricity & Optics",
          topics: ["Mechanics", "Electricity", "Optics"]
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Minimal background for better performance */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5"></div>
      
      <div className="relative z-10">
        <Navbar />

      {/* Optimized Hero Section - minimal animations */}
      <section className="pt-20 pb-16 hero-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center text-primary-foreground"
          >
            <motion.button
              onClick={handleBackToHome}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground mb-8 transition-all duration-150 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/15 hover:shadow-lg hover:shadow-white/10"
            >
              <ArrowLeft size={20} />
              Back to Home
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6"
            >
              <div className="relative inline-block">
                <div className="relative p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 mb-6 shadow-2xl">
                  <div className="relative">
                    <BookOpen size={48} className="text-white relative z-10" />
                    <Sparkles size={24} className="text-yellow-300 absolute -top-2 -right-2" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent leading-tight"
            >
              Study Materials
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-xl sm:text-2xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Access comprehensive study materials for all classes to enhance your learning journey
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Optimized Study Materials - minimal animations */}
      <section className="py-24 relative" ref={ref}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <div className="inline-block p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl mb-6 shadow-lg">
              <BookOpen size={32} className="text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Class-wise Study Materials
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Select your class to access comprehensive study materials, detailed notes, and practice papers designed for academic excellence.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Optimized School Classes Section */}
            {classes.map((className, classIndex) => {
              const subjects = getSubjectsForClass(className);
              return (
                <motion.div
                  key={className}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: classIndex * 0.03 }}
                  className="relative group"
                >
                  <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl transition-all duration-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                          <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4 rounded-2xl shadow-lg">
                            <BookOpen size={28} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {className}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {subjects.length} subjects available
                          </p>
                        </div>
                      </div>

                      <div className={`grid gap-6 ${subjects.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                        {subjects.map((subject, index) => {
                          const IconComponent = subject.icon;
                          return (
                            <motion.div
                              key={subject.name}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : {}}
                              transition={{
                                duration: 0.25,
                                delay: classIndex * 0.03 + index * 0.01,
                              }}
                              whileHover={{ scale: 1.01, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className="group/card relative"
                            >
                              <Link
                                to={`/subject/${className.toLowerCase().replace(" ", "-")}/${subject.name.toLowerCase()}`}
                                className="block"
                              >
                                <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 hover:border-primary/30 transition-all duration-150 overflow-hidden">
                                  <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 ${
                                    subject.name === 'Mathematics' ? 'bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10' :
                                    subject.name === 'Science' ? 'bg-gradient-to-br from-green-500/10 via-transparent to-green-600/10' :
                                    subject.name === 'Physics' ? 'bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/10' :
                                    subject.name === 'Chemistry' ? 'bg-gradient-to-br from-green-500/10 via-transparent to-green-600/10' :
                                    subject.name === 'Biology' ? 'bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/10' :
                                    'bg-gradient-to-br from-primary/10 via-transparent to-secondary/10'
                                  }`}></div>
                                  
                                  <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className={`${subject.color} text-white p-4 rounded-2xl mb-4 shadow-lg transform group-hover/card:rotate-2 transition-transform duration-150 relative overflow-hidden`}>
                                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150"></div>
                                      <IconComponent size={28} className="relative z-10" />
                                    </div>
                                    <h4 className={`font-bold text-foreground mb-2 text-lg transition-colors duration-150 ${
                                      subject.name === 'Mathematics' ? 'group-hover/card:text-blue-600' :
                                      subject.name === 'Science' ? 'group-hover/card:text-green-600' :
                                      subject.name === 'Physics' ? 'group-hover/card:text-purple-600' :
                                      subject.name === 'Chemistry' ? 'group-hover/card:text-green-600' :
                                      subject.name === 'Biology' ? 'group-hover/card:text-orange-600' :
                                      'group-hover/card:text-primary'
                                    }`}>
                                      {subject.name}
                                    </h4>

                                    <div className={`w-8 h-1 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 ${
                                      subject.name === 'Mathematics' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                      subject.name === 'Science' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                      subject.name === 'Physics' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                                      subject.name === 'Chemistry' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                      subject.name === 'Biology' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                      'bg-gradient-to-r from-primary to-secondary'
                                    }`}></div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Optimized Competitive Exams Section */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl mb-4 shadow-lg">
                  <div className="relative">
                    <Target size={28} className="text-amber-500 relative z-10" />
                    <Star size={16} className="text-yellow-400 absolute -top-1 -right-1" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Competitive Exam Preparation
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Advanced materials for JEE and NEET preparation with comprehensive study resources.
                </p>
              </motion.div>
              
              {competitiveExams.map((exam, examIndex) => {
                const ExamIcon = exam.icon;
                return (
                  <motion.div
                    key={exam.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: (classes.length + examIndex) * 0.03 }}
                    className="relative group"
                  >
                    <div className="relative bg-gradient-to-br from-amber-500/5 via-card/50 to-orange-500/5 backdrop-blur-xl border-2 border-amber-500/20 rounded-3xl p-8 shadow-2xl transition-all duration-200 overflow-hidden">
                      <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                        <Star size={12} />
                        {exam.badge}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-8">
                          <div className="relative">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl shadow-xl">
                              <ExamIcon size={32} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-3xl font-bold text-foreground bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                              {exam.name}
                            </h3>
                            <p className="text-muted-foreground text-lg">{exam.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {exam.subjects.map((subject, index) => {
                            const IconComponent = subject.icon;
                            return (
                              <motion.div
                                key={subject.name}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{
                                  duration: 0.25,
                                  delay: (classes.length + examIndex) * 0.03 + index * 0.01,
                                }}
                                whileHover={{ scale: 1.01, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group/card relative"
                              >
                                <Link
                                  to={`/subject/${exam.name.toLowerCase().replace(" ", "-")}/${subject.name.toLowerCase()}`}
                                  className="block"
                                >
                                  <div className="relative bg-background/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-150 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150"></div>
                                    
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                      <div className={`${subject.color} text-white p-4 rounded-2xl mb-4 shadow-lg transform group-hover/card:rotate-3 group-hover/card:scale-102 transition-all duration-150`}>
                                        <IconComponent size={28} />
                                      </div>
                                      <h4 className="font-bold text-foreground mb-2 text-lg group-hover/card:text-amber-600 transition-colors duration-150">
                                        {subject.name}
                                      </h4>

                                      <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-150"></div>
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Optimized Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-20"
          >
            <div className="relative bg-gradient-to-br from-primary/5 via-card/50 to-secondary/5 backdrop-blur-xl border border-border/50 rounded-3xl p-12 text-center overflow-hidden">
              <div className="relative z-10">
                <div className="inline-block p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl mb-6 shadow-lg">
                  <BookOpen size={40} className="text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Need More Resources?
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Can't find what you're looking for? Our team is here to help you access additional study materials or specific topic resources tailored to your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    onClick={handleContactRedirect} 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-primary/25"
                  >
                    Contact Us
                  </motion.button>
                  <motion.button 
                    onClick={handleBackToHome} 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary px-8 py-4 text-lg font-semibold"
                  >
                    Back to Home
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default StudyMaterial;
