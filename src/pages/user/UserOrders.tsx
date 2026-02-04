import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  ShoppingCart,
  Plus,
  Loader2,
  Calendar,
  IndianRupee,
  Clock,
  Check,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  order_date: string;
  delivery_date: string | null;
  quantity_liters: number;
  price_per_liter: number;
  total_amount: number;
  status: string;
  payment_status: string;
  notes: string | null;
}

const UserOrders: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState(80);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '1',
    notes: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
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

      setCustomerId(customerData.id);

      // Fetch orders and current price
      const [ordersRes, priceRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('customer_id', customerData.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('milk_prices')
          .select('price_per_liter')
          .order('effective_from', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      setOrders(ordersRes.data || []);
      if (priceRes.data) {
        setCurrentPrice(Number(priceRes.data.price_per_liter));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    setIsLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!customerId) return;

    const quantity = parseFloat(formData.quantity);
    if (!quantity || quantity <= 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid quantity' });
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from('orders').insert({
      customer_id: customerId,
      quantity_liters: quantity,
      price_per_liter: currentPrice,
      total_amount: quantity * currentPrice,
      notes: formData.notes.trim() || null,
      status: 'pending',
      payment_status: 'pending'
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success!', description: 'Order placed successfully' });
      setIsDialogOpen(false);
      setFormData({ quantity: '1', notes: '' });
      fetchData();
    }

    setIsSaving(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <Check className="h-4 w-4" />;
      case 'delivered': return <Check className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/30';
      default: return '';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      default: return '';
    }
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
        <div className="text-center text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Account not linked</p>
        </div>
      </div>
    );
  }

  const totalAmount = parseFloat(formData.quantity || '0') * currentPrice;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            {language === 'te' ? 'నా ఆర్డర్లు' : language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}
          </h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-golden">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'te' ? 'కొత్త ఆర్డర్' : language === 'hi' ? 'नया ऑर्डर' : 'New Order'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'te' ? 'ఆర్డర్ ఇవ్వండి' : language === 'hi' ? 'ऑर्डर दें' : 'Place Order'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Quantity (Liters)</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={formData.quantity}
                  onChange={(e) => setFormData(p => ({ ...p, quantity: e.target.value }))}
                />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span>₹{currentPrice}/L</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any special instructions..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handlePlaceOrder} disabled={isSaving} className="btn-golden">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Place Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(order.order_date), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{Number(order.quantity_liters).toFixed(2)}L</span>
                      <span className="text-muted-foreground">×</span>
                      <span className="text-muted-foreground">₹{Number(order.price_per_liter)}/L</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{Number(order.total_amount).toFixed(0)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                      <Badge className={getPaymentColor(order.payment_status)} variant="outline">
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>
                </div>
                {order.notes && (
                  <p className="text-sm text-muted-foreground mt-2 pt-2 border-t">
                    {order.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'te' ? 'ఆర్డర్లు లేవు' : language === 'hi' ? 'कोई ऑर्डर नहीं' : 'No orders yet'}</p>
              <Button className="mt-4 btn-golden" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Place First Order
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
