import React, { useState } from "react";
import { db, storage, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const classes = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "IIT Preparation", "NEET Preparation"];

const getSubjectsForClass = (className: string) => {
  if (className.includes("Class 7") || className.includes("Class 8") || 
      className.includes("Class 9") || className.includes("Class 10")) {
    return ["Mathematics", "Science"];
  } else if (className.includes("Class 11") || className.includes("Class 12")) {
    return ["Mathematics", "Physics", "Chemistry", "Biology"];
  } else if (className.includes("IIT Preparation")) {
    return ["Mathematics", "Physics", "Chemistry"];
  } else if (className.includes("NEET Preparation")) {
    return ["Biology", "Chemistry", "Physics"];
  }
  return ["Mathematics", "Physics", "Chemistry", "Biology"];
};

const UploadMaterial: React.FC = () => {
  const [className, setClassName] = useState(classes[0]);
  const [subject, setSubject] = useState(getSubjectsForClass(classes[0])[0]);
  const [chapter, setChapter] = useState("");
  const [sectionType, setSectionType] = useState<"Notes" | "Homework">("Notes");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get available subjects for current class
  const availableSubjects = getSubjectsForClass(className);

  // Update subject when class changes
  const handleClassChange = (newClassName: string) => {
    setClassName(newClassName);
    const newSubjects = getSubjectsForClass(newClassName);
    if (!newSubjects.includes(subject)) {
      setSubject(newSubjects[0]);
    }
  };

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
        navigate("/omegaproclassesadminrohansir");
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto pt-8 p-6">
        <div className="bg-card rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Upload Study Material</h3>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Class</label>
              <select value={className} onChange={(e)=>handleClassChange(e.target.value)} className="input">
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
              <select value={subject} onChange={(e)=>setSubject(e.target.value)} className="input">
                {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Chapter Name</label>
              <input 
                className="input" 
                placeholder="Enter chapter name" 
                value={chapter} 
                onChange={(e)=>setChapter(e.target.value)} 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Material Type</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={sectionType==="Notes"} 
                    onChange={()=>setSectionType("Notes")}
                    className="text-primary focus:ring-primary"
                  /> 
                  <span className="text-foreground">Notes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={sectionType==="Homework"} 
                    onChange={()=>setSectionType("Homework")}
                    className="text-primary focus:ring-primary"
                  /> 
                  <span className="text-foreground">Homework</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Upload File</label>
              <input 
                type="file" 
                onChange={(e)=>setFile(e.target.files?.[0] ?? null)}
                className="input"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                required
              />
            </div>

            {progress !== null && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm font-medium text-foreground mb-2">
                  Uploading: {progress}%
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{width: `${progress}%`}}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button 
                className="btn-primary flex-1" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Material"}
              </button>
              <button 
                type="button" 
                className="btn-ghost px-8" 
                onClick={()=>navigate("/omegaproclassesadminrohansir")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterial;