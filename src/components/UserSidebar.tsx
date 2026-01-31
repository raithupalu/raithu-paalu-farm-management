import React from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  ShoppingCart,
  CreditCard,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Milk,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface UserSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: BarChart3, path: '/dashboard', labelKey: 'progress' as const },
  { icon: ShoppingCart, path: '/dashboard/orders', labelKey: 'orders' as const },
  { icon: CreditCard, path: '/dashboard/payments', labelKey: 'payments' as const },
  { icon: Calendar, path: '/dashboard/subscription', labelKey: 'subscription' as const },
  { icon: MessageSquare, path: '/dashboard/requests', labelKey: 'requests' as const },
  { icon: User, path: '/dashboard/profile', labelKey: 'profile' as const },
];

export const UserSidebar: React.FC<UserSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Milk className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="ml-3 font-display text-xl font-bold text-foreground">
            {t('appName')}
          </span>
        )}
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.phone || 'Customer'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <RouterNavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-muted',
                    isActive && 'bg-primary/10 text-primary border-l-4 border-primary -ml-0.5 pl-2.5',
                    !isActive && 'text-muted-foreground'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                  {!collapsed && <span className="font-medium">{t(item.labelKey)}</span>}
                </RouterNavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10',
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
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};
