import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import {
  Milk,
  IndianRupee,
  Calendar,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MilkEntry {
  id: string;
  entry_date: string;
  quantity_liters: number;
  total_amount: number;
}

interface UserStats {
  monthlyQuantity: number;
  monthlyAmount: number;
  deliveryDays: number;
  pendingAmount: number;
}

const UserDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    monthlyQuantity: 0,
    monthlyAmount: 0,
    deliveryDays: 0,
    pendingAmount: 0
  });
  const [entries, setEntries] = useState<MilkEntry[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const fetchUserData = async () => {
    setIsLoading(true);
    
    try {
      // First get customer ID for this user
      const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (!customerData) {
        setIsLoading(false);
        return;
      }

      setCustomerId(customerData.id);

      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

      // Fetch milk entries and orders in parallel
      const [entriesRes, ordersRes] = await Promise.all([
        supabase
          .from('milk_entries')
          .select('id, entry_date, quantity_liters, total_amount')
          .eq('customer_id', customerData.id)
          .gte('entry_date', monthStart)
          .lte('entry_date', monthEnd)
          .order('entry_date', { ascending: false }),
        
        supabase
          .from('orders')
          .select('total_amount, payment_status')
          .eq('customer_id', customerData.id)
          .neq('payment_status', 'paid')
      ]);

      const monthEntries = entriesRes.data || [];
      setEntries(monthEntries);

      const monthlyQuantity = monthEntries.reduce((sum, e) => sum + Number(e.quantity_liters), 0);
      const monthlyAmount = monthEntries.reduce((sum, e) => sum + Number(e.total_amount), 0);
      const deliveryDays = monthEntries.length;
      const pendingAmount = ordersRes.data?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

      setStats({
        monthlyQuantity,
        monthlyAmount,
        deliveryDays,
        pendingAmount
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    
    setIsLoading(false);
  };

  // Generate calendar data for current month
  const today = new Date();
  const monthDays = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today)
  });

  const getDeliveryForDate = (date: Date) => {
    return entries.find(e => isSameDay(new Date(e.entry_date), date));
  };

  // Get this week's data
  const getWeekData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const delivery = getDeliveryForDate(date);
      result.push({
        day: days[i],
        date,
        delivered: !!delivery,
        quantity: delivery ? `${Number(delivery.quantity_liters).toFixed(1)}L` : '-'
      });
    }
    return result;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Milk className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {language === 'te' ? 'మీ ఖాతా ఇంకా సక్రియం కాలేదు' : 
             language === 'hi' ? 'आपका खाता अभी तक सक्रिय नहीं है' : 
             'Your account is not yet linked to a customer profile'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'te' ? 'దయచేసి అడ్మిన్‌ను సంప్రదించండి' : 
             language === 'hi' ? 'कृपया एडमिन से संपर्क करें' : 
             'Please contact the admin to link your account'}
          </p>
        </div>
      </div>
    );
  }

  const weekData = getWeekData();
  const monthlyTarget = 30;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('monthlyMilk')}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.monthlyQuantity.toFixed(1)} L
                </p>
                <Progress value={(stats.monthlyQuantity / monthlyTarget) * 100} className="mt-2 h-2" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Milk className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'te' ? 'డెలివరీ రోజులు' : 
                   language === 'hi' ? 'डिलीवरी दिन' : 'Delivery Days'}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.deliveryDays}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'te' ? 'ఈ నెల' : 
                   language === 'hi' ? 'इस महीने' : 'this month'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'te' ? 'నెలవారీ బిల్లు' : 
                   language === 'hi' ? 'मासिक बिल' : 'Monthly Bill'}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹{stats.monthlyAmount.toFixed(0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`stat-card ${stats.pendingAmount > 0 ? 'border-warning/50' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('pendingPayments')}
                </p>
                <p className={`text-2xl font-bold mt-1 ${stats.pendingAmount > 0 ? 'text-warning' : 'text-success'}`}>
                  ₹{stats.pendingAmount.toFixed(0)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.pendingAmount > 0 ? 'bg-warning/10' : 'bg-success/10'}`}>
                <TrendingUp className={`h-6 w-6 ${stats.pendingAmount > 0 ? 'text-warning' : 'text-success'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* This Week's Deliveries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {language === 'te' ? 'ఈ వారం' : 
             language === 'hi' ? 'इस सप्ताह' : 'This Week'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((day, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center transition-colors ${
                  day.delivered 
                    ? 'bg-success/10 border border-success/30' 
                    : 'bg-muted/50 border border-border'
                }`}
              >
                <p className="text-xs font-medium text-muted-foreground">{day.day}</p>
                <div className={`w-8 h-8 rounded-full mx-auto my-2 flex items-center justify-center ${
                  day.delivered ? 'bg-success' : 'bg-muted'
                }`}>
                  <Milk className={`h-4 w-4 ${day.delivered ? 'text-success-foreground' : 'text-muted-foreground'}`} />
                </div>
                <p className={`text-sm font-semibold ${day.delivered ? 'text-success' : 'text-muted-foreground'}`}>
                  {day.quantity}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'te' ? 'ఇటీవలి డెలివరీలు' : 
             language === 'hi' ? 'हाल की डिलीवरी' : 'Recent Deliveries'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.slice(0, 10).map(entry => (
                <div 
                  key={entry.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {format(new Date(entry.entry_date), 'EEEE, dd MMM')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Number(entry.quantity_liters).toFixed(2)}L
                    </p>
                  </div>
                  <span className="font-semibold text-primary">
                    ₹{Number(entry.total_amount).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Milk className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{language === 'te' ? 'ఈ నెల డెలివరీలు లేవు' : 
                  language === 'hi' ? 'इस महीने कोई डिलीवरी नहीं' : 
                  'No deliveries this month'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
