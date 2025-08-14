import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertCircle, Info, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<'info' | 'important' | 'assignment' | 'exam' | 'update'>('info');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both title and message are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add the notification using the context
      addNotification({
        title,
        message,
        type,
        priority,
        read: false,
      });

      toast({
        title: "✅ Announcement Posted",
        description: "Your announcement has been posted successfully.",
      });

      // Reset form
      setTitle("");
      setMessage("");
      setType('info');
      setPriority('medium');
      onClose();
    } catch (error) {
      toast({
        title: "Error posting announcement",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      case 'important':
        return <AlertCircle className="w-4 h-4" />;
      case 'exam':
        return <Calendar className="w-4 h-4" />;
      case 'update':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-background border-border shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                        <Send size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Post Announcement</h3>
                        <p className="text-sm text-muted-foreground font-normal">Send a notification to all students</p>
                      </div>
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                      <X size={20} />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Announcement Title *
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., New Assignment Posted"
                        className="w-full"
                        maxLength={100}
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Message *
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your announcement message here..."
                        className="w-full min-h-[100px] resize-none"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {message.length}/500 characters
                      </p>
                    </div>

                    {/* Type and Priority */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Type
                        </label>
                        <Select value={type} onValueChange={(value: any) => setType(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-500" />
                                Information
                              </div>
                            </SelectItem>
                            <SelectItem value="assignment">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-green-500" />
                                Assignment
                              </div>
                            </SelectItem>
                            <SelectItem value="exam">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                Exam
                              </div>
                            </SelectItem>
                            <SelectItem value="important">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                Important
                              </div>
                            </SelectItem>
                            <SelectItem value="update">
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-purple-500" />
                                Update
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Priority
                        </label>
                        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                Low
                              </span>
                            </SelectItem>
                            <SelectItem value="medium">
                              <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                Medium
                              </span>
                            </SelectItem>
                            <SelectItem value="high">
                              <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                High
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Preview */}
                    {(title || message) && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Preview
                        </label>
                        <div className={`p-3 rounded-lg border-l-4 ${
                          priority === 'high' 
                            ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20'
                            : priority === 'medium'
                            ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                            : 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getTypeIcon(type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground text-sm">
                                {title || "Announcement Title"}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {message || "Your announcement message will appear here..."}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">Just now</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  priority === 'high' 
                                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                    : priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                  {priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 gap-2"
                        disabled={isSubmitting || !title.trim() || !message.trim()}
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                        {isSubmitting ? "Posting..." : "Post Announcement"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementModal;