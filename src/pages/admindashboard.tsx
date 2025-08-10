// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from "@/contexts/Authcontext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, BookOpen, Download, Trash2, Upload, LogOut, Users, GraduationCap, Calculator, Atom, Microscope, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const AdminDashboard: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const { logout } = useAuth();

  const load = async () => {
    setLoading(true);
    const q = query(collection(db, "materials"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setMaterials(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (m: Material) => {
    if (!confirm(`Delete ${m.fileName}?`)) return;
    try {
      // delete from storage
      await deleteObject(ref(storage, m.storagePath));
    } catch (e) {
      console.warn("file delete error (maybe missing):", e);
    }
    // delete from Firestore
    await deleteDoc(doc(db, "materials", m.id));
    setMaterials(prev => prev.filter(x => x.id !== m.id));
  };

  // Get available classes
  const availableClasses = [...new Set(materials.map(m => m.className))].sort();
  
  // Filter materials by selected class
  const filteredMaterials = selectedClass && selectedClass !== "all"
    ? materials.filter(m => m.className === selectedClass)
    : materials;

  // Group filtered materials by subject
  const groupedMaterials = filteredMaterials.reduce((acc, material) => {
    const key = material.subject;
    if (!acc[key]) {
      acc[key] = {
        className: material.className,
        subject: material.subject,
        materials: []
      };
    }
    acc[key].materials.push(material);
    return acc;
  }, {} as Record<string, { className: string; subject: string; materials: Material[] }>);

  const getSubjectIcon = (subject: string) => {
    switch (subject?.toLowerCase()) {
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

  const getSubjectColor = (subject: string) => {
    switch (subject?.toLowerCase()) {
      case 'mathematics':
        return 'from-blue-500 to-blue-600';
      case 'physics':
        return 'from-purple-500 to-purple-600';
      case 'chemistry':
        return 'from-green-500 to-green-600';
      case 'biology':
        return 'from-red-500 to-red-600';
      default:
        return 'from-primary to-primary/80';
    }
  };

  const getTotalStats = () => {
    const totalNotes = materials.filter(m => m.type === 'Notes').length;
    const totalHomework = materials.filter(m => m.type === 'Homework').length;
    const totalClasses = new Set(materials.map(m => m.className)).size;
    const totalSubjects = new Set(materials.map(m => m.subject)).size;
    
    return { totalNotes, totalHomework, totalClasses, totalSubjects };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage study materials and assignments</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="default" className="gap-2">
                <Link to="/admin/upload">
                  <Upload size={16} />
                  Upload Material
                </Link>
              </Button>
              <Button variant="outline" onClick={() => logout()} className="gap-2">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 text-white p-3 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalNotes}</p>
                    <p className="text-sm text-muted-foreground">Notes Uploaded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 text-white p-3 rounded-lg">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalHomework}</p>
                    <p className="text-sm text-muted-foreground">Homework Assigned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 text-white p-3 rounded-lg">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalClasses}</p>
                    <p className="text-sm text-muted-foreground">Classes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 text-white p-3 rounded-lg">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalSubjects}</p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Class Filter */}
        {availableClasses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Select Class</h3>
                      <p className="text-sm text-muted-foreground">Choose a class to view its materials</p>
                    </div>
                  </div>
                  <div className="ml-auto w-64">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {availableClasses.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Materials by Subject */}
        <div className="space-y-8">
          {Object.entries(groupedMaterials).map(([key, group], groupIndex) => {
            const SubjectIcon = getSubjectIcon(group.subject);
            const gradientColor = getSubjectColor(group.subject);
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className={`bg-gradient-to-r ${gradientColor} text-white`}>
                    <CardTitle className="flex items-center gap-3">
                      <SubjectIcon size={24} />
                      <div>
                        <h3 className="text-xl font-bold">{group.subject}</h3>
                        <p className="text-white/90 text-sm">{group.className}</p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {group.materials.filter(m => m.type === 'Notes').length} Notes
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {group.materials.filter(m => m.type === 'Homework').length} Homework
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {group.materials.map((material, materialIndex) => (
                        <motion.div
                          key={material.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: materialIndex * 0.05 }}
                          className="p-6 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-2 h-2 rounded-full ${material.type === 'Notes' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                <h4 className="font-semibold text-foreground">{material.fileName}</h4>
                                <Badge 
                                  variant={material.type === 'Notes' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {material.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Chapter: {material.chapter}
                              </p>
                              {material.createdAt && (
                                <p className="text-xs text-muted-foreground">
                                  Uploaded: {new Date(material.createdAt.toDate()).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="gap-2"
                              >
                                <a
                                  href={material.downloadURL}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Download size={14} />
                                  Open
                                </a>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(material)}
                                className="gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {materials.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Materials Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by uploading your first study material or assignment.
                </p>
                <Button asChild className="gap-2">
                  <Link to="/admin/upload">
                    <Upload size={16} />
                    Upload Material
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
