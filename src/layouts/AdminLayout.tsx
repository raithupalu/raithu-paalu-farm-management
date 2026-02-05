import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AdminSidebar from '@/components/AdminSidebar';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Check if we're on the overview page
  const isOverview = location.pathname === '/admin';

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Overview';
    if (path === '/admin/milk-entry') return 'Milk Entry';
    if (path === '/admin/customers') return 'Customers';
    if (path === '/admin/orders') return 'Orders';
    if (path === '/admin/buffaloes') return 'Buffaloes';
    if (path === '/admin/expenses') return 'Expenses';
    if (path === '/admin/inventory') return 'Inventory';
    if (path === '/admin/reports') return 'Reports';
    if (path === '/admin/logs') return 'Logs';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}>
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div>
            {isOverview ? (
              <h1 className="font-display text-xl font-semibold text-foreground">
                {t('welcomeBack')}, {user?.role === 'admin' ? 'admin' : user?.name || 'Admin'}
              </h1>
            ) : (
              <h1 className="font-display text-xl font-semibold text-foreground">
                {getPageTitle()}
              </h1>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content - Dynamic based on route */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
