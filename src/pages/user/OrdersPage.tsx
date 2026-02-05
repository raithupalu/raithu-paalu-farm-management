import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder, getOrdersByUser } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Phone, Clock, CheckCircle, XCircle } from "lucide-react";

const quantities = [0.5, 0.75, 1, 1.5, 2, 2.5, 3];

type OrderStatus = 'pending' | 'approved' | 'delivered' | 'cancelled';

interface Order {
  _id: string;
  userId: string;
  userName: string;
  quantity: number;
  status: OrderStatus;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

const OrdersPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    if (user) {
      try {
        const data = await getOrdersByUser(user._id);
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load orders"
        });
      }
    }
  }, [user, toast]);

  // Initial load and polling for real-time updates
  useEffect(() => {
    loadOrders();
    
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const submitOrder = async () => {
    if (!quantity || !address.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select quantity and enter delivery address"
      });
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        userId: user._id,
        userName: user.name,
        quantity,
        address: address.trim(),
        phone: user.phone,
      });

      toast({
        title: "Success",
        description: "Order placed successfully!"
      });

      setQuantity(null);
      setAddress("");
      setShowForm(false);
      loadOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to place order"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '➕ Place New Order'}
        </Button>
      </div>

      {/* Order Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Place New Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Quantity (Liters)</Label>
              <div className="flex flex-wrap gap-2">
                {quantities.map((q) => (
                  <Button
                    key={q}
                    variant={quantity === q ? "default" : "outline"}
                    onClick={() => setQuantity(q)}
                    className="w-16"
                  >
                    {q} L
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={submitOrder} disabled={!quantity || !address.trim() || loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Submit Order'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Order History</h2>
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground">Place your first order to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <div className={`px-4 py-2 border-b flex items-center justify-between ${getStatusColor(order.status)}`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-medium capitalize">{order.status}</span>
                  </div>
                  <span className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="text-xl font-bold">{order.quantity} L</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono text-sm">{order._id}</p>
                    </div>
                  </div>
                  {order.address && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Address</p>
                          <p className="font-medium">{order.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
