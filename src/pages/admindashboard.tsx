// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from "@/contexts/Authcontext";
import { Link } from "react-router-dom";

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
  const { logout } = useAuth();

  const load = async () => {
    const q = query(collection(db, "materials"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setMaterials(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
          <div className="flex gap-3">
            <Link to="/admin/upload" className="btn-primary">
              Upload Material
            </Link>
            <button className="btn-ghost" onClick={() => logout()}>
              Logout
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {materials.map(m => (
            <div key={m.id} className="p-6 bg-card rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition-shadow">
              <div>
                <div className="font-semibold text-lg text-foreground">
                  {m.fileName} 
                  <span className="text-sm text-muted-foreground ml-2">({m.type})</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {m.className} • {m.subject} • {m.chapter}
                </div>
              </div>
              <div className="flex gap-3">
                <a 
                  href={m.downloadURL} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-secondary"
                >
                  Open
                </a>
                <button 
                  className="btn-destructive" 
                  onClick={()=>handleDelete(m)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {materials.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No materials uploaded yet. Click "Upload Material" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
