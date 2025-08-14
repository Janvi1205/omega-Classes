import { motion } from "framer-motion";
import { TrendingUp, Users, BookOpen, Award, BarChart3, Calendar, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Material {
  id: string;
  className: string;
  subject: string;
  chapter: string;
  type: string;
  fileName: string;
  downloadURL: string;
  storagePath: string;
  createdAt?: any;
}

interface AdminDashboardOverviewProps {
  materials: Material[];
  selectedClass: string;
  onAnnouncementClick: () => void;
}

export function AdminDashboardOverview({ materials, selectedClass, onAnnouncementClick }: AdminDashboardOverviewProps) {
  const filteredMaterials = selectedClass && selectedClass !== "all"
    ? materials.filter(m => m.className === selectedClass)
    : materials;

  const totalNotes = filteredMaterials.filter(m => m.type === 'Notes').length;
  const totalHomework = filteredMaterials.filter(m => m.type === 'Homework').length;
  const totalClasses = new Set(filteredMaterials.map(m => m.className)).size;
  const totalSubjects = new Set(filteredMaterials.map(m => m.subject)).size;

  // Calculate engagement metrics
  const notesPercentage = materials.length ? (totalNotes / materials.length) * 100 : 0;
  const homeworkPercentage = materials.length ? (totalHomework / materials.length) * 100 : 0;

  // Generate dynamic recent activity based on materials
  const getRecentActivity = () => {
    const activities = filteredMaterials
      .filter(material => material.createdAt)
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 5) // Show only last 5 activities
      .map(material => {
        const createdDate = material.createdAt?.toDate ? material.createdAt.toDate() : new Date(material.createdAt);
        const timeAgo = getTimeAgo(createdDate);
        const actionType = material.type === 'Notes' ? 'uploaded' : 'created';
        const color = material.type === 'Notes' ? 'bg-green-500' : 
                     material.type === 'Homework' ? 'bg-blue-500' : 'bg-orange-500';
        
        return {
          id: material.id,
          title: `${material.subject} ${material.type.toLowerCase()} ${actionType}`,
          subtitle: `${material.chapter} - Class ${material.className}`,
          time: timeAgo,
          color
        };
      });

    // If no recent materials, show default activities
    if (activities.length === 0) {
      return [
        {
          id: '1',
          title: 'No recent activity',
          subtitle: 'Upload materials to see activity',
          time: '',
          color: 'bg-gray-400'
        }
      ];
    }

    return activities;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const recentActivity = getRecentActivity();

  const stats = [
    {
      title: "Total Materials",
      value: filteredMaterials.length,
      description: "Study materials uploaded",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50",
      iconBg: "bg-blue-500",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Study Notes",
      value: totalNotes,
      description: "Available for students",
      icon: Award,
      color: "text-emerald-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50",
      iconBg: "bg-emerald-500",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Assignments",
      value: totalHomework,
      description: "Active homework tasks",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50",
      iconBg: "bg-orange-500",
      change: "+15%",
      trend: "up"
    },
  ];

  const quickActions = [
    {
      title: "Post Announcement",
      description: "Notify students about important updates",
      icon: Bell,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      action: onAnnouncementClick
    },
    {
      title: "Upload Materials",
      description: "Add new study resources",
      icon: BookOpen,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      href: "/admin/upload"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden border-0 ${stat.bgColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <Badge variant="secondary" className="text-xs bg-white/80 text-green-700">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.iconBg} shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">
                  {stat.description}
                </p>
              </CardContent>
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`${action.color} rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  onClick={action.action || (() => window.location.href = action.href || "#")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{action.title}</h3>
                      <p className="text-sm text-white/80">{action.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Content Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Study Notes</span>
                <span>{totalNotes} ({notesPercentage.toFixed(0)}%)</span>
              </div>
              <Progress value={notesPercentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Assignments</span>
                <span>{totalHomework} ({homeworkPercentage.toFixed(0)}%)</span>
              </div>
              <Progress value={homeworkPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors duration-200"
                >
                  <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  <div className="text-sm flex-1">
                    <p className="font-medium">{activity.title}</p>
                    {activity.subtitle && (
                      <p className="text-xs text-muted-foreground/80">{activity.subtitle}</p>
                    )}
                    {activity.time && (
                      <p className="text-muted-foreground">{activity.time}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No recent activity</p>
                  <p className="text-xs">Upload materials to see activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}