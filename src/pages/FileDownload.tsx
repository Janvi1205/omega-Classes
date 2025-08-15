import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Download, FileText, AlertCircle, Loader2, Eye, ArrowLeft, FileImage, FileVideo, FileAudio, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const FileDownload: React.FC = () => {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!materialId) {
        setError("Invalid material ID");
        setLoading(false);
        return;
      }

      try {
        const materialDoc = await getDoc(doc(db, "materials", materialId));
        if (materialDoc.exists()) {
          setMaterial({ id: materialDoc.id, ...materialDoc.data() });
        } else {
          setError("Material not found");
        }
      } catch (err) {
        console.error("Error fetching material:", err);
        setError("Failed to load material");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <FileImage className="h-8 w-8 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return <FileVideo className="h-8 w-8 text-blue-500" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <FileAudio className="h-8 w-8 text-purple-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileArchive className="h-8 w-8 text-orange-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'Image File';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return 'Video File';
      case 'mp3':
      case 'wav':
      case 'flac':
        return 'Audio File';
      case 'zip':
      case 'rar':
      case '7z':
        return 'Archive File';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      case 'ppt':
      case 'pptx':
        return 'PowerPoint Presentation';
      case 'txt':
        return 'Text File';
      default:
        return 'File';
    }
  };

  const canPreview = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt'].includes(extension || '');
  };

  const handleDownload = async () => {
    if (!material?.downloadURL) {
      setError("Download URL not available");
      return;
    }

    setDownloading(true);
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = material.downloadURL;
      link.download = material.fileName || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 2000);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download file");
    } finally {
      setDownloading(false);
    }
  };

  const handleView = () => {
    if (!material?.downloadURL) {
      setError("View URL not available");
      return;
    }

    // Open in new tab for viewing
    window.open(material.downloadURL, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading material...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Material not found"}
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate(-1)} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div className="h-6 w-px bg-border"></div>
          <h1 className="text-lg font-semibold text-foreground">File Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {getFileIcon(material.fileName)}
            </div>
            <CardTitle className="text-xl font-bold text-foreground mb-2">
              {material.fileName}
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="secondary">
                {getFileType(material.fileName)}
              </Badge>
              <Badge variant="outline">
                {material.type}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Ready to download or view
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Material Details */}
            <div className="space-y-3 text-sm bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject:</span>
                <span className="font-medium">{material.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class:</span>
                <span className="font-medium">{material.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chapter:</span>
                <span className="font-medium">{material.chapter}</span>
              </div>
              {material.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded:</span>
                  <span className="font-medium">
                    {new Date(material.createdAt.toDate()).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleDownload} 
                disabled={downloading}
                className="w-full gap-2"
                size="lg"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloading ? "Downloading..." : "Download File"}
              </Button>
              
              {canPreview(material.fileName) && (
                <Button 
                  onClick={handleView} 
                  variant="outline" 
                  className="w-full gap-2"
                  size="lg"
                >
                  <Eye className="h-4 w-4" />
                  Preview in Browser
                </Button>
              )}
            </div>

            {/* File Type Info */}
            <div className="text-center text-xs text-muted-foreground">
              <p>
                {canPreview(material.fileName) 
                  ? "This file can be previewed in your browser" 
                  : "This file type requires download to view"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileDownload;
