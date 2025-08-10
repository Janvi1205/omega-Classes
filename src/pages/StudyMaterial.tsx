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

  const subjects = [
    {
      name: "Mathematics",
      icon: Calculator,
      description: "Algebra, Geometry, Calculus & more",
      color: "bg-blue-500",
    },
    {
      name: "Physics",
      icon: Zap,
      description: "Mechanics, Electricity, Optics & more",
      color: "bg-purple-500",
    },
    {
      name: "Chemistry",
      icon: Atom,
      description: "Organic, Inorganic, Physical Chemistry",
      color: "bg-green-500",
    },
    {
      name: "Biology",
      icon: Microscope,
      description: "Life Sciences, Botany, Zoology & more",
      color: "bg-red-500",
    },
  ];

  const classes = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

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

          <div className="space-y-12">
            {classes.map((className, classIndex) => (
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

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-background rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        <Link
                          to={`/subject/${className.toLowerCase().replace(" ", "-")}/${subject.name.toLowerCase()}`}
                          className="block"
                        >
                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`${subject.color} text-white p-3 sm:p-4 rounded-full mb-3 sm:mb-4`}
                            >
                              <IconComponent size={24} className="sm:w-8 sm:h-8" />
                            </div>
                            <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-lg">
                              {subject.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                              {subject.description}
                            </p>
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
