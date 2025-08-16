// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from "@/contexts/Authcontext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, BookOpen, Download, Trash2, Upload, Filter, LogOut, GraduationCap, Megaphone } from "lucide-react";
import AnnouncementModal from "@/components/AnnouncementModal";
import { AdminDashboardOverview } from "@/components/AdminDashboardOverview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const { adminLogout } = useAuth();
  const { addNotification, notifications } = useNotifications();

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
      <header className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage your educational content and resources
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                addNotification({
                  title: "Test Notification",
                  message: "This is a test notification from admin dashboard",
                  type: "info",
                  priority: "medium",
                  read: false,
                });
              }}
              variant="outline" 
              className="gap-2"
            >
              Test Notification
            </Button>
            <Button 
              onClick={() => setIsAnnouncementModalOpen(true)}
              variant="secondary" 
              className="gap-2"
            >
              <Megaphone size={16} />
              Post Announcement
            </Button>
            <Button asChild variant="default" className="gap-2">
              <Link to="/omegaproclassesadminrohansir/upload">
                <Upload size={16} />
                Upload Material
              </Link>
            </Button>
            <Button variant="outline" onClick={adminLogout} className="gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-8">
          {/* Enhanced Dashboard Overview */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your educational content.
              </p>
            </div>
            <AdminDashboardOverview 
              materials={materials} 
              selectedClass={selectedClass}
              onAnnouncementClick={() => setIsAnnouncementModalOpen(true)}
            />
          </section>

          {/* Filters */}
          {availableClasses.length > 0 && (
            <section>
              <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter size={20} />
                    Class Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-foreground">
                      Select Class to Filter:
                    </label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-64 bg-background">
                        <SelectValue placeholder="All Classes" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-xl z-[9999]">
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

          {/* Materials by Type - Two Column Layout */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Study Materials Management
                {selectedClass !== "all" && (
                  <span className="text-base font-normal text-muted-foreground ml-2">
                    for {selectedClass}
                  </span>
                )}
              </h2>
              <p className="text-muted-foreground">Manage and organize educational content by type</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Notes Column */}
              <div>
                <Card className="h-full">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-blue-500 text-white p-2 rounded-lg">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Study Notes</h3>
                        <p className="text-muted-foreground text-sm">Learning materials and references</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {filteredMaterials.filter(m => m.type === 'Notes').length} items
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border max-h-96 overflow-y-auto">
                      {filteredMaterials.filter(m => m.type === 'Notes').length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={24} className="text-blue-500" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-2">No Notes Yet</h3>
                          <p className="text-muted-foreground text-sm">Upload study notes to get started</p>
                        </div>
                      ) : (
                        filteredMaterials.filter(m => m.type === 'Notes').map((material) => (
                          <motion.div
                            key={material.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <h4 className="font-semibold text-foreground text-sm truncate">{material.fileName}</h4>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">Subject:</span> {material.subject}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">Chapter:</span> {material.chapter}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">Class:</span> {material.className}
                                  </p>
                                  {material.createdAt && (
                                    <p className="text-xs text-muted-foreground">
                                      <span className="font-medium">Uploaded:</span> {new Date(material.createdAt.toDate()).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = material.downloadURL;
                                    link.download = material.fileName;
                                    link.target = '_blank';
                                    link.rel = 'noopener noreferrer';
                                    link.style.display = 'none';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="gap-1"
                                >
                                  <Download size={12} />
                                  Download
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(material)}
                                  className="gap-1"
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Homework Column */}
              <div>
                <Card className="h-full">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-orange-500 text-white p-2 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Assignments</h3>
                        <p className="text-muted-foreground text-sm">Homework and practice tasks</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {filteredMaterials.filter(m => m.type === 'Homework').length} items
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border max-h-96 overflow-y-auto">
                      {filteredMaterials.filter(m => m.type === 'Homework').length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={24} className="text-orange-500" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-2">No Assignments Yet</h3>
                          <p className="text-muted-foreground text-sm">Upload homework assignments to get started</p>
                        </div>
                      ) : (
                        filteredMaterials.filter(m => m.type === 'Homework').map((material) => (
                          <motion.div
                            key={material.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                  <h4 className="font-semibold text-foreground text-sm truncate">{material.fileName}</h4>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">Subject:</span> {material.subject}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">Chapter:</span> {material.chapter}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">Class:</span> {material.className}
                                  </p>
                                  {material.createdAt && (
                                    <p className="text-xs text-muted-foreground">
                                      <span className="font-medium">Uploaded:</span> {new Date(material.createdAt.toDate()).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = material.downloadURL;
                                    link.download = material.fileName;
                                    link.target = '_blank';
                                    link.rel = 'noopener noreferrer';
                                    link.style.display = 'none';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="gap-1"
                                >
                                  <Download size={12} />
                                  Download
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(material)}
                                  className="gap-1"
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>



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
                    <Link to="/omegaproclassesadminrohansir/upload">
                      <Upload size={16} />
                      Upload Material
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      {/* Announcement Modal */}
      <AnnouncementModal 
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;