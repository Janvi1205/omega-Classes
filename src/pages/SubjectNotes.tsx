// src/pages/SubjectNotes.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from 'framer-motion';
import { Download, FileText, BookOpen, ArrowLeft, Calculator, Atom, Microscope, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

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
      
      // First, let's get ALL materials to see what's actually in the database
      const allMaterialsQuery = query(collection(db, "materials"));
      const allSnap = await getDocs(allMaterialsQuery);
      const allMaterials = allSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      
      console.log("ALL MATERIALS IN DATABASE:", allMaterials);
      console.log("Total materials count:", allMaterials.length);
      
      // Now try the specific query
      const q = query(
        collection(db, "materials"),
        where("className", "==", properClassName),
        where("subject", "==", properSubject)
      );
      
      try {
        const snap = await getDocs(q);
        const materialsData = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        
        console.log("FILTERED Query results:", materialsData);
        console.log("Number of filtered materials found:", materialsData.length);
        
        // Let's also try a looser search to see if there are case issues
        console.log("Looking for materials with similar class/subject:");
        const similarMaterials = allMaterials.filter(m => 
          m.className?.toLowerCase().includes('class 7') || 
          m.className?.toLowerCase().includes('class-7') ||
          m.subject?.toLowerCase().includes('physics')
        );
        console.log("Similar materials found:", similarMaterials);
        
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

  // Group materials by type (Notes vs Homework) and then by chapter
  const notesMaterials = materials.filter(material => material.type === 'Notes');
  const homeworkMaterials = materials.filter(material => material.type === 'Homework');

  const groupedNotes = notesMaterials.reduce((acc, material) => {
    const chapter = material.chapter || 'Untitled';
    if (!acc[chapter]) {
      acc[chapter] = [];
    }
    acc[chapter].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  const groupedHomework = homeworkMaterials.reduce((acc, material) => {
    const chapter = material.chapter || 'Untitled';
    if (!acc[chapter]) {
      acc[chapter] = [];
    }
    acc[chapter].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  console.log("Materials from state:", materials);
  console.log("Notes materials:", notesMaterials);
  console.log("Homework materials:", homeworkMaterials);
  console.log("Grouped notes:", groupedNotes);
  console.log("Grouped homework:", groupedHomework);
  console.log("Number of note chapters:", Object.keys(groupedNotes).length);
  console.log("Number of homework chapters:", Object.keys(groupedHomework).length);
  
  // Debug: Show the actual material data
  if (materials.length > 0) {
    console.log("First material details:", materials[0]);
    console.log("Chapter name:", materials[0].chapter);
    console.log("File name:", materials[0].fileName);
    console.log("Download URL:", materials[0].downloadURL);
    console.log("Material type:", materials[0].type);
  }
  
  console.log("isInView state:", isInView);
  console.log("Should render notes:", Object.keys(groupedNotes).length > 0);
  console.log("Should render homework:", Object.keys(groupedHomework).length > 0);

  // Download handler function
  const handleDownload = async (material: Material) => {
    try {
      // Show loading toast
      toast({
        title: "Starting Download",
        description: `Downloading ${material.fileName}...`,
        duration: 2000,
      });

      // Simple approach: open in new tab with download intent
      const link = document.createElement('a');
      link.href = material.downloadURL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = material.fileName;
      
      // Trigger click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success toast
      setTimeout(() => {
        toast({
          title: "Download Started",
          description: `${material.fileName} should start downloading. If it opens in browser, right-click and select "Save As".`,
          duration: 4000,
        });
      }, 500);
      
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed", 
        description: "Please try right-clicking the file and selecting 'Save Link As'.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

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

      {/* Notes Section */}
      <section className="py-20" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} 
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-xl">
                <BookOpen size={28} />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Study Notes
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chapter-wise study notes and comprehensive learning materials.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedNotes).map(([chapterName, chapterMaterials], index) => (
              <motion.div 
                key={`notes-${chapterName}`}
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }} 
                className="card-gradient rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl"></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">Study Notes</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg leading-tight">
                      {chapterName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        <span>{chapterMaterials.length} {chapterMaterials.length === 1 ? 'note' : 'notes'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {chapterMaterials.map((material, materialIndex) => (
                    <motion.button
                      key={material.id}
                      onClick={() => handleDownload(material)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary py-3 px-4 rounded-lg font-medium flex items-center justify-between gap-2 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <Download size={16} />
                        <span className="truncate">{material.fileName}</span>
                      </div>
                      <span className="text-xs bg-primary-foreground/20 px-2 py-1 rounded-md font-medium">
                        Notes
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {Object.keys(groupedNotes).length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }} 
              className="text-center py-12"
            >
              <div className="card-gradient rounded-2xl p-8 border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  No Study Notes Available
                </h3>
                <p className="text-muted-foreground mb-6">
                  Study notes for {subject} {className?.replace('-', ' ')} haven't been uploaded yet.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Homework Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} 
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-secondary text-secondary-foreground p-3 rounded-xl">
                <FileText size={28} />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Homework & Assignments
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Practice exercises and homework assignments for skill development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedHomework).map(([chapterName, chapterMaterials], index) => (
              <motion.div 
                key={`homework-${chapterName}`}
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }} 
                className="card-gradient rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-3xl"></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-xs font-medium text-secondary uppercase tracking-wide">Homework</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg leading-tight">
                      {chapterName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        <span>{chapterMaterials.length} {chapterMaterials.length === 1 ? 'assignment' : 'assignments'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {chapterMaterials.map((material, materialIndex) => (
                    <motion.button
                      key={material.id}
                      onClick={() => handleDownload(material)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-secondary py-3 px-4 rounded-lg font-medium flex items-center justify-between gap-2 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <Download size={16} />
                        <span className="truncate">{material.fileName}</span>
                      </div>
                      <span className="text-xs bg-secondary-foreground/20 px-2 py-1 rounded-md font-medium">
                        Homework
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {Object.keys(groupedHomework).length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }} 
              className="text-center py-12"
            >
              <div className="card-gradient rounded-2xl p-8 border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  No Homework Available
                </h3>
                <p className="text-muted-foreground mb-6">
                  Homework assignments for {subject} {className?.replace('-', ' ')} haven't been uploaded yet.
                </p>
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