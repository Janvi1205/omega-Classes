import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Users, TrendingUp } from "lucide-react";

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

interface AdminStatsProps {
  materials: Material[];
  selectedClass: string;
}

export function AdminStats({ materials, selectedClass }: AdminStatsProps) {
  const filteredMaterials = selectedClass && selectedClass !== "all"
    ? materials.filter(m => m.className === selectedClass)
    : materials;

  const totalNotes = filteredMaterials.filter(m => m.type === 'Notes').length;
  const totalHomework = filteredMaterials.filter(m => m.type === 'Homework').length;
  const totalClasses = new Set(filteredMaterials.map(m => m.className)).size;
  const totalSubjects = new Set(filteredMaterials.map(m => m.subject)).size;

  const stats = [
    {
      title: "Total Materials",
      value: filteredMaterials.length,
      description: "Study materials uploaded",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Notes",
      value: totalNotes,
      description: "Study notes available",
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Assignments",
      value: totalHomework,
      description: "Homework assignments",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      title: selectedClass === "all" ? "Classes" : "Subjects",
      value: selectedClass === "all" ? totalClasses : totalSubjects,
      description: selectedClass === "all" ? "Total classes" : "Subjects covered",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}