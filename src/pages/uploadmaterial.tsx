import React, { useState } from "react";
import { db, storage, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const classes = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology"];

const UploadMaterial: React.FC = () => {
  const [className, setClassName] = useState(classes[0]);
  const [subject, setSubject] = useState(subjects[0]);
  const [chapter, setChapter] = useState("");
  const [sectionType, setSectionType] = useState<"Notes" | "Homework">("Notes");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    setLoading(true);

    // create a storage path
    const safeChapter = chapter.trim() || "untitled";
    const storagePath = `materials/${className}/${subject}/${safeChapter}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(pct));
      },
      (error) => {
        setLoading(false);
        alert("Upload failed: " + error.message);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        // save metadata in Firestore
        await addDoc(collection(db, "materials"), {
          className,
          subject,
          chapter: safeChapter,
          type: sectionType,
          fileName: file.name,
          storagePath,
          downloadURL,
          uploadedBy: auth.currentUser?.uid || null,
          createdAt: serverTimestamp(),
        });
        setLoading(false);
        setProgress(null);
        alert("Uploaded successfully");
        navigate("/admin");
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-card rounded">
      <h3 className="text-xl font-semibold mb-4">Upload study material</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <select value={className} onChange={(e)=>setClassName(e.target.value)} className="input">
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={subject} onChange={(e)=>setSubject(e.target.value)} className="input">
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <input className="input" placeholder="Chapter name" value={chapter} onChange={(e)=>setChapter(e.target.value)} />

        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" checked={sectionType==="Notes"} onChange={()=>setSectionType("Notes")} /> Notes</label>
          <label className="flex items-center gap-2"><input type="radio" checked={sectionType==="Homework"} onChange={()=>setSectionType("Homework")} /> Homework</label>
        </div>

        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />

        {progress !== null && <div>Uploading: {progress}%</div>}

        <div className="flex gap-3">
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload"}</button>
          <button type="button" className="btn-secondary" onClick={()=>navigate("/admin")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UploadMaterial;