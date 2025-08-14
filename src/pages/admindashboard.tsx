// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from "@/contexts/Authcontext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, BookOpen, Download, Trash2, Upload, Calculator, Atom, Microscope, Zap, Filter } from "lucide-react";
import AnnouncementModal from "@/components/AnnouncementModal";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminStats } from "@/components/AdminStats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
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
    const key = selectedClass === "all" 
      ? `${material.className}-${material.subject}`
      : material.subject;
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
      case 'science':
        return Atom;
      default:
        return BookOpen;
    }
  };

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar onAnnouncementClick={() => setIsAnnouncementModalOpen(true)} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-card border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your educational content and resources
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button asChild variant="default" className="gap-2">
                  <Link to="/admin/upload">
                    <Upload size={16} />
                    Upload Material
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6 space-y-8">
            {/* Stats Overview */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
              <AdminStats materials={materials} selectedClass={selectedClass} />
            </section>

            {/* Filters */}
            {availableClasses.length > 0 && (
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter size={20} />
                      Filter by Class
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-foreground">
                        Select Class:
                      </label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-64">
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
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Materials by Subject */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Study Materials
                {selectedClass !== "all" && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    for {selectedClass}
                  </span>
                )}
              </h2>
              
              <div className="space-y-6">
                {Object.entries(groupedMaterials).map(([key, group], groupIndex) => {
                  const SubjectIcon = getSubjectIcon(group.subject);
                  
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIndex * 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                                <SubjectIcon size={20} />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground">{group.subject}</h3>
                                <p className="text-muted-foreground text-sm">{group.className}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary">
                                {group.materials.filter(m => m.type === 'Notes').length} Notes
                              </Badge>
                              <Badge variant="secondary">
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
                                className="p-6 hover:bg-muted/50 transition-colors group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className={`w-3 h-3 rounded-full ${
                                        material.type === 'Notes' ? 'bg-blue-500' : 'bg-orange-500'
                                      }`}></div>
                                      <h4 className="font-semibold text-foreground group-hover:text-foreground">
                                        {material.fileName}
                                      </h4>
                                      <Badge variant={material.type === 'Notes' ? 'default' : 'secondary'}>
                                        {material.type}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground group-hover:text-muted-foreground mb-2">
                                      Chapter: {material.chapter}
                                    </p>
                                    {material.createdAt && (
                                      <p className="text-xs text-muted-foreground group-hover:text-muted-foreground">
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
                                        View
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
                        <FileText size={24} className="text-muted-foreground" />
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
            </section>
          </main>
        </div>

        {/* Announcement Modal */}
        <AnnouncementModal 
          isOpen={isAnnouncementModalOpen}
          onClose={() => setIsAnnouncementModalOpen(false)}
        />
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
