import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Milk,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getMilkStats, getPaymentStats, getUsers, getBuffaloStats, getExpenseStats } from '@/services/api';

interface MilkStats {
  today: { totalQuantity: number; totalAmount: number };
  thisMonth: { totalQuantity: number; totalAmount: number };
  dailyStats: { _id: string; quantity: number }[];
}

interface PaymentStats {
  total: number;
  thisMonth: number;
  pending: number;
  pendingCount: number;
}

interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

interface BuffaloStats {
  total: number;
  healthy: number;
  sick: number;
  pregnant: number;
  totalProduction: number;
}

interface ExpenseStats {
  thisMonth: number;
  pending: number;
  byCategory: { _id: string; total: number }[];
}

const AdminOverview: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [milkStats, setMilkStats] = useState<MilkStats | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [buffaloStats, setBuffaloStats] = useState<BuffaloStats | null>(null);
  const [expenseStats, setExpenseStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [milk, payment, userData, buffalo, expense] = await Promise.all([
          getMilkStats(),
          getPaymentStats(),
          getUsers(),
          getBuffaloStats(),
          getExpenseStats()
        ]);
        
        setMilkStats(milk);
        setPaymentStats(payment);
        setUsers(userData);
        setBuffaloStats(buffalo);
        setExpenseStats(expense);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      titleKey: 'todaysMilk' as const,
      value: `${milkStats?.today?.totalQuantity?.toFixed(1) || 0} L`,
      change: '+12%',
      trend: 'up' as const,
      icon: Milk,
      color: 'primary' as const,
    },
    {
      titleKey: 'monthlyMilk' as const,
      value: `${milkStats?.thisMonth?.totalQuantity?.toFixed(0) || 0} L`,
      change: '+8%',
      trend: 'up' as const,
      icon: Calendar,
      color: 'success' as const,
    },
    {
      titleKey: 'totalCustomers' as const,
      value: users.length.toString(),
      change: `+${users.filter(u => u.status === 'active').length}`,
      trend: 'up' as const,
      icon: Users,
      color: 'accent' as const,
    },
    {
      titleKey: 'todaysIncome' as const,
      value: `₹${milkStats?.today?.totalAmount?.toLocaleString() || 0}`,
      change: '+15%',
      trend: 'up' as const,
      icon: IndianRupee,
      color: 'success' as const,
    },
    {
      titleKey: 'pendingPayments' as const,
      value: `₹${paymentStats?.pending?.toLocaleString() || 0}`,
      change: `${paymentStats?.pendingCount || 0} customers`,
      trend: 'down' as const,
      icon: AlertCircle,
      color: 'warning' as const,
    },
    {
      titleKey: 'totalBuffaloes' as const,
      value: buffaloStats?.total?.toString() || '0',
      change: `${buffaloStats?.healthy || 0} healthy`,
      trend: 'up' as const,
      icon: Milk,
      color: 'primary' as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t(stat.titleKey)}
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

      {/* Quick Actions & Recent Activity */}
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
            <Button className="w-full justify-start btn-golden" onClick={() => navigate('/admin/milk-entry')}>
              <Milk className="mr-2 h-4 w-4" />
              {t('milkEntry')}
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/customers')}>
              <Users className="mr-2 h-4 w-4" />
              {language === 'te' ? 'కస్టమర్ జోడించు' : 
               language === 'hi' ? 'ग्राहक जोड़ें' : 'Add Customer'}
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/expenses')}>
              <IndianRupee className="mr-2 h-4 w-4" />
              {language === 'te' ? 'ఖర్చు జోడించు' : 
               language === 'hi' ? 'खर्च जोड़ें' : 'Add Expense'}
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/prices')}>
              <AlertCircle className="mr-2 h-4 w-4" />
              {language === 'te' ? 'ధర నవీకరించు' : 
               language === 'hi' ? 'कीमत अपडेट करें' : 'Update Price'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {language === 'te' ? 'ఇటీవలి కస్టమర్లు' : 
               language === 'hi' ? 'हाल के ग्राहक' : 'Recent Customers'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/customers')}>
              {language === 'te' ? 'అన్నీ చూడండి' : 
               language === 'hi' ? 'सभी देखें' : 'View All'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((customer) => (
                <div 
                  key={customer._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green/10 text-green-600' :
                      customer.status === 'pending' ? 'bg-yellow/10 text-yellow-600' :
                      'bg-red/10 text-red-600'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'te' ? 'నెలవారీ ట్రెండ్' : 
             language === 'hi' ? 'मासिक रुझान' : 'Monthly Trend'}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <div className="flex items-end justify-between h-full gap-2">
            {milkStats?.dailyStats?.slice(-6).map((day, i) => (
              <div key={day._id} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-primary/20 rounded-t"
                  style={{ height: `${(day.quantity / (Math.max(...milkStats.dailyStats.map(d => d.quantity)) || 1)) * 100}%` }}
                >
                  <div 
                    className="w-full bg-primary rounded-t transition-all duration-500"
                    style={{ height: '100%' }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(day._id).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Income vs Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'te' ? 'ఆదాయం vs ఖర్చులు' : 
             language === 'hi' ? 'आय vs खर्च' : 'Income vs Expenses'}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className="text-muted-foreground">
                  Income: ₹{milkStats?.thisMonth?.totalAmount?.toLocaleString() || 0} | 
                  Expenses: ₹{expenseStats?.thisMonth?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500"
                  style={{ width: `${((milkStats?.thisMonth?.totalAmount || 0) / ((milkStats?.thisMonth?.totalAmount || 0) + (expenseStats?.thisMonth || 0))) * 100}%` }}
                />
                <div 
                  className="bg-red-400"
                  style={{ width: `${((expenseStats?.thisMonth || 0) / ((milkStats?.thisMonth?.totalAmount || 0) + (expenseStats?.thisMonth || 0))) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
