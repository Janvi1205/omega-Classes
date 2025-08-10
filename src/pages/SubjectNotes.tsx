// src/pages/SubjectNotes.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SubjectNotes: React.FC = () => {
  const { className, subject } = useParams();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      
      // Debug logging
      const decodedSubject = decodeURIComponent(subject || "");
      const processedClassName = className?.replace("-", " ") || className;
      
      console.log("SubjectNotes Debug:");
      console.log("- URL className:", className);
      console.log("- Processed className:", processedClassName);
      console.log("- URL subject:", subject);
      console.log("- Decoded subject:", decodedSubject);
      
      const q = query(
        collection(db, "materials"),
        where("className", "==", processedClassName),
        where("subject", "==", decodedSubject)
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

  if (loading) return <div>Loading...</div>;
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Materials</h2>
      <div className="space-y-3">
        {materials.map(m => (
          <div key={m.id} className="p-4 bg-card rounded flex justify-between">
            <div>
              <div className="font-semibold">{m.fileName}</div>
              <div className="text-sm">{m.chapter} • {m.type}</div>
            </div>
            <a className="btn-secondary" href={m.downloadURL} target="_blank" rel="noreferrer">Open</a>
          </div>
        ))}
        {materials.length === 0 && <div>No materials yet.</div>}
      </div>
    </div>
  );
};

export default SubjectNotes;
