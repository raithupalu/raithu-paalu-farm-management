import { useEffect, useState, useCallback } from "react";
import { getAllOrders, getUsers, approveOrder, cancelOrder } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Check, X, MapPin, Phone, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

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

interface User {
  _id: string;
  name?: string;
  username?: string;
  phone?: string;
  address?: string;
}

const AdminOrdersPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [ordersData, usersData] = await Promise.all([
        getAllOrders(),
        getUsers()
      ]);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial load and polling for real-time updates
  useEffect(() => {
    fetchData();
    
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleApprove = async (orderId: string) => {
    setProcessingOrder(orderId);
    try {
      await approveOrder(orderId);
      toast({
        title: "Success",
        description: "Order approved successfully"
      });
      // Refetch to ensure consistency
      await fetchData();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve order"
      });
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setProcessingOrder(orderId);
    try {
      await cancelOrder(orderId);
      toast({
        title: "Success",
        description: "Order cancelled successfully"
      });
      // Refetch to ensure consistency
      await fetchData();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel order"
      });
    } finally {
      setProcessingOrder(null);
    }
  };

  const getUserById = (userId: string): User => {
    return users.find(u => u._id === userId) || { _id: userId, name: 'Unknown', phone: 'N/A' };
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

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const approvedOrders = orders.filter(o => o.status === 'approved');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {language === 'te' ? 'ఆర్డర్లు' : language === 'hi' ? 'ऑर्डर' : 'Orders'}
        </h1>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {language === 'te' ? 'రిఫ్రెష్' : language === 'hi' ? 'रीफ्रेश' : 'Refresh'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Loader2 className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{pendingOrders.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-xl font-bold">{approvedOrders.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Check className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-xl font-bold">{deliveredOrders.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-xl font-bold">{cancelledOrders.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Card className="border-2 border-primary">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer Name</p>
                <p className="font-semibold">{selectedOrder.userName || getUserById(selectedOrder.userId).name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {selectedOrder.phone || getUserById(selectedOrder.userId).phone}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Delivery Address</p>
                <p className="font-semibold flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  {selectedOrder.address || getUserById(selectedOrder.userId).address || 'No address provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-semibold">{selectedOrder.quantity} L</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm">{selectedOrder._id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'te' ? 'మొత్తం ఆర్డర్లు' : language === 'hi' ? 'कुल ऑर्डर' : 'Total Orders'}: {orders.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                {language === 'te' ? 'ఆర్డర్లు లేవు' : language === 'hi' ? 'कोई ऑर्डर नहीं' : 'No orders found'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const userInfo = getUserById(order.userId);
                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order.userName || userInfo.name}
                        <p className="text-xs text-muted-foreground">{userInfo.phone}</p>
                      </TableCell>
                      <TableCell>{order.quantity} L</TableCell>
                      <TableCell>
                        <p className="max-w-xs truncate">{order.address || userInfo.address || '-'}</p>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                onClick={() => handleApprove(order._id)}
                                disabled={processingOrder === order._id}
                              >
                                {processingOrder === order._id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <><Check className="h-3 w-3 mr-1" /> Approve</>
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                                onClick={() => handleCancel(order._id)}
                                disabled={processingOrder === order._id}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
