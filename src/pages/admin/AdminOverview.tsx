import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Milk,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  todaysMilk: number;
  monthlyMilk: number;
  totalCustomers: number;
  activeCustomers: number;
  totalBuffaloes: number;
  activeBuffaloes: number;
  pendingPayments: number;
  pendingCustomerCount: number;
  todaysIncome: number;
  monthlyIncome: number;
}

interface RecentEntry {
  id: string;
  customer_name: string;
  quantity: number;
  time: string;
  amount: number;
}

const AdminOverview: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const startOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');

    try {
      // Fetch all data in parallel
      const [
        todayMilkRes,
        monthMilkRes,
        customersRes,
        buffaloesRes,
        ordersRes,
        recentEntriesRes
      ] = await Promise.all([
        // Today's milk entries
        supabase
          .from('milk_entries')
          .select('quantity_liters, total_amount')
          .eq('entry_date', today),
        
        // Monthly milk entries
        supabase
          .from('milk_entries')
          .select('quantity_liters, total_amount')
          .gte('entry_date', startOfMonth),
        
        // Customers
        supabase
          .from('customers')
          .select('id, is_active'),
        
        // Buffaloes
        supabase
          .from('buffaloes')
          .select('id, status'),
        
        // Orders with pending payments
        supabase
          .from('orders')
          .select('total_amount, payment_status, customer_id')
          .neq('payment_status', 'paid'),
        
        // Recent entries with customer info
        supabase
          .from('milk_entries')
          .select('id, quantity_liters, total_amount, created_at, customers(name)')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Calculate stats
      const todaysMilk = todayMilkRes.data?.reduce((sum, e) => sum + Number(e.quantity_liters), 0) || 0;
      const todaysIncome = todayMilkRes.data?.reduce((sum, e) => sum + Number(e.total_amount), 0) || 0;
      const monthlyMilk = monthMilkRes.data?.reduce((sum, e) => sum + Number(e.quantity_liters), 0) || 0;
      const monthlyIncome = monthMilkRes.data?.reduce((sum, e) => sum + Number(e.total_amount), 0) || 0;
      
      const totalCustomers = customersRes.data?.length || 0;
      const activeCustomers = customersRes.data?.filter(c => c.is_active).length || 0;
      
      const totalBuffaloes = buffaloesRes.data?.length || 0;
      const activeBuffaloes = buffaloesRes.data?.filter(b => b.status === 'active').length || 0;
      
      const pendingPayments = ordersRes.data?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
      const pendingCustomerCount = new Set(ordersRes.data?.map(o => o.customer_id)).size || 0;

      setStats({
        todaysMilk,
        monthlyMilk,
        totalCustomers,
        activeCustomers,
        totalBuffaloes,
        activeBuffaloes,
        pendingPayments,
        pendingCustomerCount,
        todaysIncome,
        monthlyIncome
      });

      // Format recent entries
      const entries: RecentEntry[] = (recentEntriesRes.data || []).map(e => ({
        id: e.id,
        customer_name: (e.customers as any)?.name || 'Unknown',
        quantity: Number(e.quantity_liters),
        time: format(new Date(e.created_at), 'h:mm a'),
        amount: Number(e.total_amount)
      }));
      setRecentEntries(entries);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    
    setIsLoading(false);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'success':
        return 'bg-success/10 text-success';
      case 'accent':
        return 'bg-accent/10 text-accent';
      case 'warning':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: t('todaysMilk'),
      value: `${stats?.todaysMilk.toFixed(1) || 0} L`,
      change: `₹${stats?.todaysIncome.toLocaleString() || 0}`,
      trend: 'up',
      icon: Milk,
      color: 'primary',
    },
    {
      title: language === 'te' ? 'నెలవారీ పాలు' : language === 'hi' ? 'मासिक दूध' : 'Monthly Milk',
      value: `${stats?.monthlyMilk.toFixed(1) || 0} L`,
      change: `₹${stats?.monthlyIncome.toLocaleString() || 0}`,
      trend: 'up',
      icon: Calendar,
      color: 'success',
    },
    {
      title: t('totalCustomers'),
      value: stats?.totalCustomers.toString() || '0',
      change: `${stats?.activeCustomers || 0} active`,
      trend: 'up',
      icon: Users,
      color: 'accent',
    },
    {
      title: t('todaysIncome'),
      value: `₹${stats?.todaysIncome.toLocaleString() || 0}`,
      change: format(new Date(), 'dd MMM'),
      trend: 'up',
      icon: IndianRupee,
      color: 'success',
    },
    {
      title: t('pendingPayments'),
      value: `₹${stats?.pendingPayments.toLocaleString() || 0}`,
      change: `${stats?.pendingCustomerCount || 0} customers`,
      trend: 'down',
      icon: AlertCircle,
      color: 'warning',
    },
    {
      title: t('totalBuffaloes'),
      value: stats?.totalBuffaloes.toString() || '0',
      change: `${stats?.activeBuffaloes || 0} milking`,
      trend: 'up',
      icon: Milk,
      color: 'primary',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'te' ? 'త్వరిత చర్యలు' : 
               language === 'hi' ? 'त्वरित कार्रवाई' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start btn-golden"
              onClick={() => navigate('/admin/milk-entry')}
            >
              <Milk className="mr-2 h-4 w-4" />
              {t('milkEntry')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/customers')}
            >
              <Users className="mr-2 h-4 w-4" />
              {language === 'te' ? 'కస్టమర్లు నిర్వహించు' : 
               language === 'hi' ? 'ग्राहक प्रबंधित करें' : 'Manage Customers'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/orders')}
            >
              <IndianRupee className="mr-2 h-4 w-4" />
              {language === 'te' ? 'ఆర్డర్లు చూడండి' : 
               language === 'hi' ? 'ऑर्डर देखें' : 'View Orders'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/expenses')}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              {language === 'te' ? 'ఖర్చులు జోడించు' : 
               language === 'hi' ? 'खर्च जोड़ें' : 'Add Expense'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {language === 'te' ? 'ఇటీవలి ఎంట్రీలు' : 
               language === 'hi' ? 'हाल की प्रविष्टियाँ' : 'Recent Entries'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/milk-entry')}>
              {language === 'te' ? 'అన్నీ చూడండి' : 
               language === 'hi' ? 'सभी देखें' : 'View All'}
            </Button>
          </CardHeader>
          <CardContent>
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{entry.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{entry.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{entry.quantity.toFixed(2)}L</p>
                      <p className="text-sm text-success">₹{entry.amount.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Milk className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{language === 'te' ? 'ఎంట్రీలు లేవు' : language === 'hi' ? 'कोई प्रविष्टियाँ नहीं' : 'No entries yet'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
