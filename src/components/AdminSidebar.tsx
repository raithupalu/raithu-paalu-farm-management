import React from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Milk,
  Receipt,
  Package,
  FileText,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, path: '/admin', labelKey: 'overview' as const },
  { icon: Milk, path: '/admin/milk-entry', label: 'Milk Entry' },
  { icon: Users, path: '/admin/customers', labelKey: 'customers' as const },
  { icon: ShoppingCart, path: '/admin/orders', labelKey: 'orders' as const },
  { icon: Milk, path: '/admin/buffaloes', labelKey: 'buffaloes' as const },
  { icon: Receipt, path: '/admin/expenses', labelKey: 'expenses' as const },
  { icon: Package, path: '/admin/inventory', labelKey: 'inventory' as const },
  { icon: FileText, path: '/admin/reports', labelKey: 'reports' as const },
  { icon: ClipboardList, path: '/admin/logs', labelKey: 'logs' as const },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Milk className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="ml-3 font-display text-xl font-bold text-sidebar-foreground">
            {t('appName')}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <RouterNavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent',
                    isActive && 'bg-sidebar-accent text-sidebar-primary border-l-4 border-sidebar-primary -ml-0.5 pl-2.5',
                    !isActive && 'text-sidebar-foreground/80'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-sidebar-primary')} />
                  {!collapsed && <span className="font-medium">{item.label || t(item.labelKey)}</span>}
                </RouterNavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">{t('logout')}</span>}
        </Button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};
