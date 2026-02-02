import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Activity, 
  History, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Users,
  ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

export function Sidebar({ activeItem = 'dashboard', onItemClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'activity', label: 'Activity', icon: Activity },
      { id: 'history', label: 'History', icon: History },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];

    if (user?.role === 'prosumer') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'generation', label: 'Generation', icon: Zap },
        { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    if (user?.role === 'consumer') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'consumption', label: 'Consumption', icon: Activity },
        { id: 'incoming', label: 'Incoming', icon: ArrowLeftRight },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    if (user?.role === 'grid') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'requests', label: 'Requests', icon: Users },
        { id: 'flow', label: 'Energy Flow', icon: ArrowLeftRight },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside 
      className={cn(
        "h-full border-r border-border bg-sidebar transition-all duration-300 flex flex-col shrink-0",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex-1 py-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              "sidebar-item mx-2 mb-1",
              activeItem === item.id && "sidebar-item-active"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 border-t border-border hover:bg-muted/30 transition-colors flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
