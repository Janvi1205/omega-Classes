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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-2">
          <Link to="/admin/upload" className="btn-primary">Upload material</Link>
          <button className="btn-ghost" onClick={() => logout()}>Logout</button>
        </div>
      </div>

      <div className="space-y-3">
        {materials.map(m => (
          <div key={m.id} className="p-4 bg-background rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-semibold">{m.fileName} <span className="text-sm text-muted">({m.type})</span></div>
              <div className="text-sm">{m.className} • {m.subject} • {m.chapter}</div>
            </div>
            <div className="flex gap-2">
              <a href={m.downloadURL} target="_blank" rel="noreferrer" className="btn-secondary">Open</a>
              <button className="btn-destructive" onClick={()=>handleDelete(m)}>Delete</button>
            </div>
          </div>
        ))}
        {materials.length === 0 && <div>No materials yet</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
