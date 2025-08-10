// src/pages/SubjectNotes.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from 'framer-motion';
import { Download, FileText, BookOpen, ArrowLeft, Calculator, Atom, Microscope, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Material = {
  id: string;
  className: string;
  subject: string;
  chapter: string;
  type: string;
  fileName: string;
  downloadURL: string;
  storagePath: string;
  createdAt?: any;
};

const SubjectNotes: React.FC = () => {
  const { className, subject } = useParams();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      
      // Fix case sensitivity issues
      const decodedSubject = decodeURIComponent(subject || "");
      const processedClassName = className?.replace("-", " ") || className;
      
      // Convert to proper case for matching
      const properClassName = processedClassName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      const properSubject = decodedSubject.charAt(0).toUpperCase() + decodedSubject.slice(1).toLowerCase();
      
      console.log("SubjectNotes Debug:");
      console.log("- URL className:", className);
      console.log("- Processed className:", properClassName);
      console.log("- URL subject:", subject);
      console.log("- Processed subject:", properSubject);
      
      const q = query(
        collection(db, "materials"),
        where("className", "==", properClassName),
        where("subject", "==", properSubject)
      );
      
      try {
        const snap = await getDocs(q);
        const materialsData = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        
        console.log("Query results:", materialsData);
        console.log("Number of materials found:", materialsData.length);
        
        setMaterials(materialsData);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
      
      setLoading(false);
    };
    load();
  }, [className, subject]);

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

  // Group materials by chapter
  const groupedMaterials = materials.reduce((acc, material) => {
    const chapter = material.chapter || 'Untitled';
    if (!acc[chapter]) {
      acc[chapter] = [];
    }
    acc[chapter].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  const IconComponent = getSubjectIcon(subject || '');
  const subjectColor = getSubjectColor(subject || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading materials...</p>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-xl mt-3 text-primary-foreground/90 capitalize">
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

      {/* Chapter Materials */}
      <section className="py-20" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={isInView ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.8 }} 
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Chapter-wise Materials
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive notes and practice materials for each chapter.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedMaterials).map(([chapterName, chapterMaterials], index) => (
              <motion.div 
                key={chapterName}
                initial={{ opacity: 0, y: 50 }} 
                animate={isInView ? { opacity: 1, y: 0 } : {}} 
                transition={{ duration: 0.6, delay: index * 0.1 }} 
                whileHover={{ scale: 1.02, y: -2 }} 
                className="card-gradient rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-3 text-lg leading-tight">
                      {chapterName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        <span>{chapterMaterials.length} files</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {chapterMaterials.map((material, materialIndex) => (
                    <motion.a
                      key={material.id}
                      href={material.downloadURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium flex items-center justify-between gap-2 hover:bg-primary/90 transition-colors block"
                    >
                      <div className="flex items-center gap-2">
                        <Download size={16} />
                        <span className="truncate">{material.fileName}</span>
                      </div>
                      <span className="text-xs bg-primary-foreground/20 px-2 py-1 rounded">
                        {material.type}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {Object.keys(groupedMaterials).length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={isInView ? { opacity: 1, y: 0 } : {}} 
              transition={{ duration: 0.8 }} 
              className="text-center py-12"
            >
              <div className="card-gradient rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  No Materials Yet!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Materials for {subject} {className?.replace('-', ' ')} haven't been uploaded yet. 
                  Check back soon or contact your teacher.
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