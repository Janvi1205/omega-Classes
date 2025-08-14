// src/pages/SubjectNotes.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from 'framer-motion';
import { Download, FileText, BookOpen, ArrowLeft, Calculator, Atom, Microscope, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

type Material = {
  id: string;
  className: string;
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
      let properClassName = processedClassName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      // Handle special cases for competitive exams
      if (properClassName.toLowerCase().includes('iit')) {
        properClassName = "IIT Preparation";
      } else if (properClassName.toLowerCase().includes('neet')) {
        properClassName = "NEET Preparation";
      }
      
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
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Floating animated shapes */}
      <div className="floating-shape" style={{top: '12%', left: '8%', width: '160px', height: '160px', background: 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)', animationDelay: '0s'}}></div>
      <div className="floating-shape" style={{top: '70%', left: '75%', width: '110px', height: '110px', background: 'linear-gradient(135deg, #f472b6 0%, #a5b4fc 100%)', animationDelay: '4s'}}></div>
      <div className="floating-shape" style={{top: '85%', left: '25%', width: '90px', height: '90px', background: 'linear-gradient(135deg, #38bdf8 0%, #a5b4fc 100%)', animationDelay: '8s'}}></div>
      <div className="floating-shape" style={{top: '5%', left: '50%', width: '70px', height: '70px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', animationDelay: '1s'}}></div>
      <div className="floating-shape" style={{top: '90%', left: '90%', width: '60px', height: '60px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', animationDelay: '9s'}}></div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/6 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-center text-primary-foreground"
          >
            <motion.div
              whileHover={{ x: -4 }}
              className="inline-block mb-8"
            >
              <Link 
                to="/study-material" 
                className="inline-flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/15"
              >
                <ArrowLeft size={20} />
                Back to Study Materials
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-6 mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                <div className={`relative ${subjectColor} text-white p-6 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20`}>
                  <IconComponent size={48} />
                </div>
              </div>
              
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent text-glow">
                  {subject}
                </h1>
                <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-4">
                  <p className="text-lg text-primary-foreground/90 capitalize font-medium">
                    {className?.replace('-', ' ')} Study Materials
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed"
            >
              Access comprehensive chapter-wise notes, detailed exercises, and curated study materials designed for academic excellence and deep understanding.
            </motion.p>
            
            {/* Progress indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center gap-6 mt-8"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-center">
                <div className="text-lg font-bold text-white">Notes</div>
                <div className="text-sm text-white/80">Study Materials</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-center">
                <div className="text-lg font-bold text-white">Practice</div>
                <div className="text-sm text-white/80">Assignments</div>
              </div>
            </motion.div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Object.entries(groupedNotes).map(([chapterName, chapterMaterials], index) => (
              <motion.div 
                key={`notes-${chapterName}`}
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }} 
                className="group relative"
              >
                {/* Glass morphism card */}
                <div className="relative bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden enhanced-card">
                  {/* Subject-specific decorative elements */}
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    subject?.toLowerCase() === 'mathematics' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20' :
                    subject?.toLowerCase() === 'science' ? 'bg-gradient-to-br from-green-500/20 to-green-600/20' :
                    subject?.toLowerCase() === 'physics' ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20' :
                    subject?.toLowerCase() === 'chemistry' ? 'bg-gradient-to-br from-green-500/20 to-green-600/20' :
                    subject?.toLowerCase() === 'biology' ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20' :
                    'bg-gradient-to-br from-primary/20 to-secondary/20'
                  }`}></div>
                  <div className={`absolute -bottom-4 -left-4 w-16 h-16 rounded-full blur-lg ${
                    subject?.toLowerCase() === 'mathematics' ? 'bg-gradient-to-tr from-blue-500/10 to-transparent' :
                    subject?.toLowerCase() === 'science' ? 'bg-gradient-to-tr from-green-500/10 to-transparent' :
                    subject?.toLowerCase() === 'physics' ? 'bg-gradient-to-tr from-purple-500/10 to-transparent' :
                    subject?.toLowerCase() === 'chemistry' ? 'bg-gradient-to-tr from-green-500/10 to-transparent' :
                    subject?.toLowerCase() === 'biology' ? 'bg-gradient-to-tr from-orange-500/10 to-transparent' :
                    'bg-gradient-to-tr from-primary/10 to-transparent'
                  }`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${
                            subject?.toLowerCase() === 'mathematics' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            subject?.toLowerCase() === 'science' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            subject?.toLowerCase() === 'physics' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                            subject?.toLowerCase() === 'chemistry' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            subject?.toLowerCase() === 'biology' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                            'bg-gradient-to-r from-primary to-secondary'
                          }`}>
                            <FileText size={14} className="sm:text-base text-white" />
                          </div>
                          <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider px-2 sm:px-3 py-1 rounded-full transition-colors duration-300 ${
                            subject?.toLowerCase() === 'mathematics' ? 'text-blue-600 bg-blue-500/10 group-hover:text-white group-hover:bg-blue-600' :
                            subject?.toLowerCase() === 'science' ? 'text-green-600 bg-green-500/10 group-hover:text-white group-hover:bg-green-600' :
                            subject?.toLowerCase() === 'physics' ? 'text-purple-600 bg-purple-500/10 group-hover:text-white group-hover:bg-purple-600' :
                            subject?.toLowerCase() === 'chemistry' ? 'text-green-600 bg-green-500/10 group-hover:text-white group-hover:bg-green-600' :
                            subject?.toLowerCase() === 'biology' ? 'text-orange-600 bg-orange-500/10 group-hover:text-white group-hover:bg-orange-600' :
                            'text-primary bg-primary/10 group-hover:text-white group-hover:bg-primary'
                          }`}>
                            Study Notes
                          </span>
                        </div>
                        <h3 className={`font-bold mb-3 sm:mb-4 text-lg sm:text-xl leading-tight transition-colors duration-300 ${
                          subject?.toLowerCase() === 'mathematics' ? 'text-foreground group-hover:text-blue-600' :
                          subject?.toLowerCase() === 'science' ? 'text-foreground group-hover:text-green-600' :
                          subject?.toLowerCase() === 'physics' ? 'text-foreground group-hover:text-purple-600' :
                          subject?.toLowerCase() === 'chemistry' ? 'text-foreground group-hover:text-green-600' :
                          subject?.toLowerCase() === 'biology' ? 'text-foreground group-hover:text-orange-600' :
                          'text-foreground group-hover:text-primary'
                        }`}>
                          {chapterName}
                        </h3>
                        <div className={`w-8 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4 ${
                          subject?.toLowerCase() === 'mathematics' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          subject?.toLowerCase() === 'science' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          subject?.toLowerCase() === 'physics' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                          subject?.toLowerCase() === 'chemistry' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          subject?.toLowerCase() === 'biology' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                          'bg-gradient-to-r from-primary to-secondary'
                        }`}></div>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/50 rounded-full px-2 sm:px-3 py-1">
                            <FileText size={12} className="sm:text-sm" />
                            <span className="font-medium">{chapterMaterials.length} {chapterMaterials.length === 1 ? 'note' : 'notes'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                {chapterMaterials.length > 1 ? (
                  <div className="relative">
                    <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {chapterMaterials.map((material, materialIndex) => (
                          <CarouselItem key={material.id} className="pl-2 md:pl-4">
                            <motion.a
                              href={material.downloadURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full btn-primary py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium flex items-center justify-between gap-1.5 sm:gap-2 transition-all duration-300 block group btn-enhanced"
                            >
                                                              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                                  <Download size={14} className="sm:text-base flex-shrink-0" />
                                  <span className="truncate text-xs sm:text-sm">{material.fileName}</span>
                                </div>
                                <span className="text-xs bg-primary-foreground/20 px-1.5 sm:px-2 py-1 rounded-md font-medium flex-shrink-0">
                                  Notes
                                </span>
                            </motion.a>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-background border-2 hover:bg-accent" />
                      <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-background border-2 hover:bg-accent" />
                    </Carousel>
                    <div className="flex justify-center mt-3 gap-1">
                      {chapterMaterials.map((_, index) => (
                        <div 
                          key={index} 
                           className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                             subject?.toLowerCase() === 'mathematics' ? 'bg-blue-500/30 hover:bg-blue-500/60' :
                             subject?.toLowerCase() === 'science' ? 'bg-green-500/30 hover:bg-green-500/60' :
                             subject?.toLowerCase() === 'physics' ? 'bg-purple-500/30 hover:bg-purple-500/60' :
                             subject?.toLowerCase() === 'chemistry' ? 'bg-green-500/30 hover:bg-green-500/60' :
                             subject?.toLowerCase() === 'biology' ? 'bg-orange-500/30 hover:bg-orange-500/60' :
                             'bg-primary/30 hover:bg-primary/60'
                           }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chapterMaterials.map((material, materialIndex) => (
                      <motion.a
                        key={material.id}
                        href={material.downloadURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-primary py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium flex items-center justify-between gap-1.5 sm:gap-2 transition-all duration-300 block btn-enhanced"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                          <Download size={14} className="sm:text-base" />
                          <span className="truncate text-xs sm:text-sm">{material.fileName}</span>
                        </div>
                        <span className="text-xs bg-primary-foreground/20 px-1.5 sm:px-2 py-1 rounded-md font-medium flex-shrink-0">
                          Notes
                        </span>
                      </motion.a>
                    ))}
                  </div>
                )}
                  </div>
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
              <div className={`p-3 rounded-xl ${
                subject?.toLowerCase() === 'mathematics' ? 'bg-blue-500 text-white' :
                subject?.toLowerCase() === 'science' ? 'bg-green-500 text-white' :
                subject?.toLowerCase() === 'physics' ? 'bg-purple-500 text-white' :
                subject?.toLowerCase() === 'chemistry' ? 'bg-green-500 text-white' :
                subject?.toLowerCase() === 'biology' ? 'bg-orange-500 text-white' :
                'bg-secondary text-secondary-foreground'
              }`}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(groupedHomework).map(([chapterName, chapterMaterials], index) => (
              <motion.div 
                key={`homework-${chapterName}`}
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }} 
                className="card-gradient rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-all duration-300 relative overflow-hidden group enhanced-card"
              >
                {/* Subject-specific decorative gradient overlay */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  subject?.toLowerCase() === 'mathematics' ? 'bg-gradient-to-br from-blue-500/10 to-transparent' :
                  subject?.toLowerCase() === 'science' ? 'bg-gradient-to-br from-green-500/10 to-transparent' :
                  subject?.toLowerCase() === 'physics' ? 'bg-gradient-to-br from-purple-500/10 to-transparent' :
                  subject?.toLowerCase() === 'chemistry' ? 'bg-gradient-to-br from-green-500/10 to-transparent' :
                  subject?.toLowerCase() === 'biology' ? 'bg-gradient-to-br from-orange-500/10 to-transparent' :
                  'bg-gradient-to-br from-secondary/10 to-transparent'
                }`}></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-xl ${
                        subject?.toLowerCase() === 'mathematics' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        subject?.toLowerCase() === 'science' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        subject?.toLowerCase() === 'physics' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        subject?.toLowerCase() === 'chemistry' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        subject?.toLowerCase() === 'biology' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        'bg-gradient-to-r from-secondary to-secondary'
                      }`}>
                        <FileText size={16} className="text-white" />
                      </div>
                      <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors duration-300 ${
                        subject?.toLowerCase() === 'mathematics' ? 'text-blue-600 bg-blue-500/10 group-hover:text-white group-hover:bg-blue-600' :
                        subject?.toLowerCase() === 'science' ? 'text-green-600 bg-green-500/10 group-hover:text-white group-hover:bg-green-600' :
                        subject?.toLowerCase() === 'physics' ? 'text-purple-600 bg-purple-500/10 group-hover:text-white group-hover:bg-purple-600' :
                        subject?.toLowerCase() === 'chemistry' ? 'text-green-600 bg-green-500/10 group-hover:text-white group-hover:bg-green-600' :
                        subject?.toLowerCase() === 'biology' ? 'text-orange-600 bg-orange-500/10 group-hover:text-white group-hover:bg-orange-600' :
                        'text-secondary bg-secondary/10 group-hover:text-white group-hover:bg-secondary'
                      }`}>
                        Homework
                      </span>
                    </div>
                    <h3 className={`font-bold mb-4 text-xl leading-tight transition-colors duration-300 ${
                      subject?.toLowerCase() === 'mathematics' ? 'text-foreground group-hover:text-blue-600' :
                      subject?.toLowerCase() === 'science' ? 'text-foreground group-hover:text-green-600' :
                      subject?.toLowerCase() === 'physics' ? 'text-foreground group-hover:text-purple-600' :
                      subject?.toLowerCase() === 'chemistry' ? 'text-foreground group-hover:text-green-600' :
                      subject?.toLowerCase() === 'biology' ? 'text-foreground group-hover:text-orange-600' :
                      'text-foreground group-hover:text-primary'
                    }`}>
                      {chapterName}
                    </h3>
                    <div className={`w-8 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4 ${
                      subject?.toLowerCase() === 'mathematics' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      subject?.toLowerCase() === 'science' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      subject?.toLowerCase() === 'physics' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                      subject?.toLowerCase() === 'chemistry' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      subject?.toLowerCase() === 'biology' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                      'bg-gradient-to-r from-primary to-secondary'
                    }`}></div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1">
                        <FileText size={14} />
                        <span className="font-medium">{chapterMaterials.length} {chapterMaterials.length === 1 ? 'assignment' : 'assignments'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {chapterMaterials.length > 1 ? (
                  <div className="relative">
                    <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {chapterMaterials.map((material, materialIndex) => (
                          <CarouselItem key={material.id} className="pl-2 md:pl-4">
                            <motion.a
                              href={material.downloadURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full btn-secondary py-3 px-4 rounded-lg font-medium flex items-center justify-between gap-2 transition-all duration-300 block group btn-enhanced"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Download size={16} className="flex-shrink-0" />
                                <span className="truncate text-sm">{material.fileName}</span>
                              </div>
                              <span className="text-xs bg-secondary-foreground/20 px-2 py-1 rounded-md font-medium flex-shrink-0">
                                Homework
                              </span>
                            </motion.a>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-background border-2 hover:bg-accent" />
                      <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-background border-2 hover:bg-accent" />
                    </Carousel>
                    <div className="flex justify-center mt-3 gap-1">
                      {chapterMaterials.map((_, index) => (
                        <div 
                          key={index} 
                           className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                             subject?.toLowerCase() === 'mathematics' ? 'bg-blue-500/30 hover:bg-blue-500/60' :
                             subject?.toLowerCase() === 'science' ? 'bg-green-500/30 hover:bg-green-500/60' :
                             subject?.toLowerCase() === 'physics' ? 'bg-purple-500/30 hover:bg-purple-500/60' :
                             subject?.toLowerCase() === 'chemistry' ? 'bg-green-500/30 hover:bg-green-500/60' :
                             subject?.toLowerCase() === 'biology' ? 'bg-orange-500/30 hover:bg-orange-500/60' :
                             'bg-secondary/30 hover:bg-secondary/60'
                           }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chapterMaterials.map((material, materialIndex) => (
                      <motion.a
                        key={material.id}
                        href={material.downloadURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-secondary py-3 px-4 rounded-lg font-medium flex items-center justify-between gap-2 transition-all duration-300 block btn-enhanced"
                      >
                        <div className="flex items-center gap-2">
                          <Download size={16} />
                          <span className="truncate">{material.fileName}</span>
                        </div>
                        <span className="text-xs bg-secondary-foreground/20 px-2 py-1 rounded-md font-medium">
                          Homework
                        </span>
                      </motion.a>
                    ))}
                  </div>
                )}
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
