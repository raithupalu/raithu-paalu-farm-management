import { useState } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
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
  TrendingUp,
  Activity,
  DollarSign,
  ClipboardCheck,
  Box,
  ChartLine,
  List,
  AlertTriangle,
  Calendar,
  Truck,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  labelKey?: string;
  label?: string;
  relatedOptions?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    action?: () => void;
  }[];
}

const menuItems: MenuItem[] = [
  { 
    icon: LayoutDashboard, 
    path: '/admin', 
    labelKey: 'overview',
    relatedOptions: []
  },
  { 
    icon: Milk, 
    path: '/admin/milk-entry', 
    label: 'Milk Entry',
    relatedOptions: []
  },
  { 
    icon: Users, 
    path: '/admin/customers', 
    labelKey: 'customers',
    relatedOptions: []
  },
  { 
    icon: ShoppingCart, 
    path: '/admin/orders', 
    labelKey: 'orders',
    relatedOptions: []
  },
  { 
    icon: Milk, 
    path: '/admin/buffaloes', 
    labelKey: 'buffaloes',
    label: 'Buffaloes',
    relatedOptions: []
  },
  { 
    icon: DollarSign, 
    path: '/admin/prices', 
    label: 'Prices',
    labelKey: 'prices',
    relatedOptions: []
  },
  { 
    icon: Receipt, 
    path: '/admin/expenses', 
    labelKey: 'expenses',
    relatedOptions: []
  },
  { 
    icon: Package, 
    path: '/admin/inventory', 
    labelKey: 'inventory',
    relatedOptions: []
  },
  { 
    icon: FileText, 
    path: '/admin/reports', 
    labelKey: 'reports',
    relatedOptions: []
  },
  { 
    icon: ClipboardList, 
    path: '/admin/logs', 
    labelKey: 'logs',
    label: 'Logs',
    relatedOptions: []
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  const { t, language } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

<<<<<<< HEAD
  const handleNavClick = (path: string, hasOptions: boolean) => {
    if (hasOptions) {
      setExpandedItem(expandedItem === path ? null : path);
    } else {
      navigate(path);
      setExpandedItem(null);
    }
  };

  const getLabel = (item: MenuItem) => {
    if (item.label) return item.label;
    if (item.labelKey && ['overview', 'customers', 'orders', 'buffaloes', 'expenses', 'inventory', 'reports', 'logs'].includes(item.labelKey)) {
      return t(item.labelKey as any);
    }
    return item.path;
=======
  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
>>>>>>> f414d65a214657a245744ac85122315c6e4af3e1
  };

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Milk className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">
              {language === 'te' ? 'రైతు పాతు' : language === 'hi' ? 'रैथू पालू' : 'Raithu Paalu'}
            </span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className={cn(collapsed && 'mx-auto')}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <RouterNavLink
                to={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.path, (item.relatedOptions?.length || 0) > 0);
                }}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  'hover:bg-accent',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  collapsed && 'justify-center'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium">{getLabel(item)}</span>
                )}
                {!collapsed && item.relatedOptions && item.relatedOptions.length > 0 && (
                  <ChevronRight className={cn(
                    'h-4 w-4 ml-auto transition-transform',
                    expandedItem === item.path && 'rotate-90'
                  )} />
                )}
              </RouterNavLink>
              
              {/* Expandable options */}
              {!collapsed && expandedItem === item.path && item.relatedOptions && (
                <ul className="mt-1 ml-9 space-y-1">
                  {item.relatedOptions.map((option, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => {
                          if (option.action) option.action();
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                          'hover:bg-accent transition-colors text-sm'
                        )}
                      >
                        {option.icon && <option.icon className="h-4 w-4" />}
                        <span>{option.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className={cn(
            'w-full justify-start gap-3',
            collapsed && 'justify-center px-0'
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>{t('logout')}</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
