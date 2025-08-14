import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Upload, 
  Megaphone, 
  LogOut,
  GraduationCap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/Authcontext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/admin", 
    icon: LayoutDashboard,
    description: "Overview and statistics"
  },
  { 
    title: "Upload Material", 
    url: "/admin/upload", 
    icon: Upload,
    description: "Add new study materials"
  },
];

const quickActions = [
  {
    title: "Announcements",
    icon: Megaphone,
    description: "Manage notifications",
    action: "announcement"
  },
];

interface AdminSidebarProps {
  onAnnouncementClick: () => void;
}

export function AdminSidebar({ onAnnouncementClick }: AdminSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-72"}>
      <SidebarContent className="bg-gradient-to-b from-slate-900 to-slate-800 text-white border-r-0 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <GraduationCap size={24} className="text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-sm text-slate-300">Education Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="py-6">
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wider font-semibold px-6 mb-3">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 px-3">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-white/10",
                          isActive 
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                            : "text-slate-300 hover:text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-sm block">{item.title}</span>
                            <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Actions */}
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wider font-semibold px-6 mb-3">
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 px-3">
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={onAnnouncementClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-300 hover:text-white hover:bg-white/10 group cursor-pointer"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-sm block">{item.title}</span>
                          <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Footer */}
        <div className="mt-auto p-6 border-t border-slate-700/50">
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full justify-start gap-3 p-3 text-slate-300 hover:text-white hover:bg-red-500/20 transition-all duration-200 rounded-xl"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}