import { useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  BarChart3,
  ShoppingCart,
  CreditCard,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  Milk,
  History,
  Package,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UserSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: BarChart3, path: '/dashboard', labelKey: 'overview' as const, label: 'Overview' },
  { icon: History, path: '/dashboard/progress', labelKey: 'progress' as const, label: 'My Progress' },
  { icon: ShoppingCart, path: '/dashboard/orders', labelKey: 'orders' as const, label: 'Orders' },
  { icon: CreditCard, path: '/dashboard/payments', labelKey: 'payments' as const, label: 'Payments' },
  { icon: Package, path: '/dashboard/subscription', labelKey: 'subscription' as const, label: 'Subscription' },
  { icon: MessageSquare, path: '/dashboard/requests', labelKey: 'requests' as const, label: 'Requests' },
  { icon: User, path: '/dashboard/profile', labelKey: 'profile' as const, label: 'Profile' },
];

const UserSidebar: React.FC<UserSidebarProps> = ({ collapsed, onToggle }) => {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-20 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border px-4">
        {collapsed ? (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Milk className="h-6 w-6 text-primary-foreground" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Milk className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              {language === 'te' ? 'రైతు పాలు' : language === 'hi' ? 'रैथू पालू' : 'Raithu Paalu'}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </RouterNavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        {!collapsed && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name || user?.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.phone || user?.email}
            </p>
          </div>
        )}
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start',
            collapsed ? 'px-0 justify-center' : ''
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">{t('logout')}</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default UserSidebar;
