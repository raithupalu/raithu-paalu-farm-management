import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  Loader2,
  Calendar,
  IndianRupee,
  Check,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: 'milk' | 'order';
  status: string;
  description: string;
}

const UserPayments: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState({
    totalPaid: 0,
    pending: 0,
    thisMonth: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchPayments();
    }
  }, [user?.id]);

  const fetchPayments = async () => {
    setIsLoading(true);
    
    try {
      // Get customer ID
      const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (!customerData) {
        setIsLoading(false);
        return;
      }

      // Fetch milk entries and orders
      const [entriesRes, ordersRes] = await Promise.all([
        supabase
          .from('milk_entries')
          .select('id, entry_date, total_amount')
          .eq('customer_id', customerData.id)
          .order('entry_date', { ascending: false })
          .limit(50),
        
        supabase
          .from('orders')
          .select('id, order_date, total_amount, payment_status')
          .eq('customer_id', customerData.id)
          .order('order_date', { ascending: false })
          .limit(20)
      ]);

      // Combine into payment records
      const allPayments: PaymentRecord[] = [];

      (entriesRes.data || []).forEach(e => {
        allPayments.push({
          id: e.id,
          date: e.entry_date,
          amount: Number(e.total_amount),
          type: 'milk',
          status: 'recorded',
          description: 'Daily milk delivery'
        });
      });

      (ordersRes.data || []).forEach(o => {
        allPayments.push({
          id: o.id,
          date: o.order_date,
          amount: Number(o.total_amount),
          type: 'order',
          status: o.payment_status,
          description: 'Order'
        });
      });

      // Sort by date
      allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPayments(allPayments);

      // Calculate stats
      const pending = (ordersRes.data || [])
        .filter(o => o.payment_status !== 'paid')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);
      
      const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const thisMonth = allPayments
        .filter(p => new Date(p.date) >= thisMonthStart)
        .reduce((sum, p) => sum + p.amount, 0);
      
      const totalPaid = (ordersRes.data || [])
        .filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

      setStats({ totalPaid, pending, thisMonth });

    } catch (error) {
      console.error('Error fetching payments:', error);
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          {language === 'te' ? 'చెల్లింపులు' : language === 'hi' ? 'भुगतान' : 'Payments'}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              {language === 'te' ? 'ఈ నెల' : language === 'hi' ? 'इस महीने' : 'This Month'}
            </p>
            <p className="text-2xl font-bold text-foreground">₹{stats.thisMonth.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className={stats.pending > 0 ? 'border-warning/50' : ''}>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              {language === 'te' ? 'పెండింగ్' : language === 'hi' ? 'लंबित' : 'Pending'}
            </p>
            <p className={`text-2xl font-bold ${stats.pending > 0 ? 'text-warning' : 'text-success'}`}>
              ₹{stats.pending.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              {language === 'te' ? 'చెల్లించారు' : language === 'hi' ? 'भुगतान किया' : 'Total Paid'}
            </p>
            <p className="text-2xl font-bold text-success">₹{stats.totalPaid.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'te' ? 'లావాదేవీ చరిత్ర' : language === 'hi' ? 'लेन-देन इतिहास' : 'Transaction History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map(payment => (
                <div 
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.type === 'milk' ? 'bg-primary/10' : 'bg-accent/10'
                    }`}>
                      {payment.type === 'milk' ? (
                        <IndianRupee className="h-5 w-5 text-primary" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-accent" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{payment.description}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(payment.date), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">₹{payment.amount.toFixed(0)}</span>
                    {payment.type === 'order' && (
                      <Badge 
                        variant="outline"
                        className={payment.status === 'paid' 
                          ? 'bg-green-500/10 text-green-600' 
                          : 'bg-yellow-500/10 text-yellow-600'
                        }
                      >
                        {payment.status === 'paid' ? <Check className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {payment.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPayments;
