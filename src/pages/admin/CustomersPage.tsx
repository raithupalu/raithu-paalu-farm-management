<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Mail, MapPin, Star, Search, Milk, IndianRupee, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { getUsers, updateUser, deleteUser, getMilkEntries, getPaymentStats } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { AddCustomerDialog } from "@/components/admin/AddCustomerDialog";
import { format, subDays } from "date-fns";
import { Progress } from "@/components/ui/progress";

interface User {
  _id: string;
  name?: string;
  username?: string;
  phone?: string;
  email?: string;
  address?: string;
  village?: string;
  taluka?: string;
  district?: string;
  status: 'active' | 'inactive' | 'pending' | string;
  createdAt?: string;
}

const CustomersPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerMilkData, setCustomerMilkData] = useState<any[]>([]);
  const [customerPaymentStats, setCustomerPaymentStats] = useState<any>(null);
  const [customerLoading, setCustomerLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getUsers();
        setCustomers(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch customers",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [toast]);

  const filteredCustomers = customers.filter(c => 
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    c.phone.includes(searchTerm) ||
    (c.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const activeCount = customers.filter(c => c.status === 'active').length;
  const pendingCount = customers.filter(c => c.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUser(userId, { status: newStatus });
      setCustomers(customers.map(c => 
        c._id === userId ? { ...c, status: newStatus } : c
      ));
      toast({
        title: "Success",
        description: "Customer status updated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    
    try {
      await deleteUser(userId);
      setCustomers(customers.filter(c => c._id !== userId));
      if (selectedCustomer?._id === userId) {
        setSelectedCustomer(null);
      }
      toast({
        title: "Success",
        description: "Customer deleted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete customer",
      });
    }
  };

  // Handle customer click - show milk entries and payment history
  const handleCustomerClick = async (customer: User) => {
    setSelectedCustomer(customer);
    setCustomerLoading(true);
    
    try {
      const milkData = await getMilkEntries({ userId: customer._id });
      setCustomerMilkData(milkData);
      
      const paymentStats = await getPaymentStats(customer._id);
      setCustomerPaymentStats(paymentStats);
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
      setCustomerMilkData([]);
      setCustomerPaymentStats(null);
    } finally {
      setCustomerLoading(false);
    }
  };

  // Calculate stats
  const totalMilk = customerMilkData.reduce((sum, e) => sum + (e.quantity || 0), 0);
  const totalAmount = customerMilkData.reduce((sum, e) => sum + (e.totalAmount || 0), 0);
  const pending = customerPaymentStats?.pending || 0;
  const paid = customerPaymentStats?.paid || 0;

  // Get last 7 days milk data for chart
  const last7DaysMilk = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayMilk = customerMilkData
      .filter(e => format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
      .reduce((sum, e) => sum + (e.quantity || 0), 0);
    return { date: format(date, 'EEE'), milk: dayMilk };
  });

  const maxMilk = Math.max(...last7DaysMilk.map(d => d.milk), 1);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
=======
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Users, Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, 
  Phone, MapPin, Loader2, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  is_active: boolean;
  subscription_type: string;
  default_quantity: number;
  created_at: string;
}

const CustomersPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    subscription_type: 'daily',
    default_quantity: '1'
  });

  const fetchCustomers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setCustomers(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      subscription_type: 'daily',
      default_quantity: '1'
    });
    setEditingCustomer(null);
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address || '',
      subscription_type: customer.subscription_type || 'daily',
      default_quantity: String(customer.default_quantity)
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name and phone are required' });
      return;
    }

    setIsSaving(true);

    const customerData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim() || null,
      subscription_type: formData.subscription_type,
      default_quantity: parseFloat(formData.default_quantity)
    };

    let error;
    if (editingCustomer) {
      ({ error } = await supabase.from('customers').update(customerData).eq('id', editingCustomer.id));
    } else {
      ({ error } = await supabase.from('customers').insert(customerData));
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success!', description: editingCustomer ? 'Customer updated' : 'Customer added' });
      setIsDialogOpen(false);
      resetForm();
      fetchCustomers();
    }
    setIsSaving(false);
  };

  const toggleActive = async (customer: Customer) => {
    const { error } = await supabase
      .from('customers')
      .update({ is_active: !customer.is_active })
      .eq('id', customer.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      fetchCustomers();
    }
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Deleted', description: 'Customer removed successfully' });
      fetchCustomers();
    }
  };
>>>>>>> f414d65a214657a245744ac85122315c6e4af3e1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'te' ? 'కస్టమర్లు' : language === 'hi' ? 'ग्राहक' : 'Customers'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'te' 
              ? 'మీ కస్టమర్లను నిర్వహించండి' 
              : language === 'hi' 
              ? 'अपने ग्राहकों का प्रबंधन करें' 
              : 'Manage your customers'}
          </p>
        </div>
        <AddCustomerDialog onCustomerAdded={() => {
          const fetchCustomers = async () => {
            try {
              const data = await getUsers();
              setCustomers(data);
            } catch (error) {
              console.error('Failed to fetch customers', error);
            }
          };
          fetchCustomers();
        }} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{customers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green/10 rounded-lg">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-xl font-bold text-green-600">{activeCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue/10 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New This Week</p>
              <p className="text-xl font-bold">
                {customers.filter(c => c.createdAt && new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={language === 'te' ? 'పేరు లేదా ఫోన్ ద్వారా శోధించండి' : 
                       language === 'hi' ? 'नाम या फोन से खोजें' : 
                       'Search by name or phone...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer List */}
        <div className="lg:col-span-2">
          {filteredCustomers.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'te' ? 'కస్టమర్లు లేవు' : language === 'hi' ? 'कोई ग्राहक नहीं' : 'No customers found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'te' 
                  ? 'మీ మొదటి కస్టమర్‌ని జోడించడానికి క్రింద బటన్‌ని క్లిక్ చేయండి' 
                  : language === 'hi' 
                  ? 'अपना पहला ग्राहक जोड़ने के लिए नीचे बटन पर क्लिक करें' 
                  : 'Click the button below to add your first customer'}
              </p>
              <AddCustomerDialog onCustomerAdded={() => {
                const fetchCustomers = async () => {
                  try {
                    const data = await getUsers();
                    setCustomers(data);
                  } catch (error) {
                    console.error('Failed to fetch customers', error);
                  }
                };
                fetchCustomers();
              }} />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCustomers.map((customer) => (
                <Card 
                  key={customer._id} 
                  className={`p-4 cursor-pointer hover:shadow-lg transition-all ${
                    selectedCustomer?._id === customer._id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedCustomer?._id === customer._id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {customer.name || customer.username}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(customer.status)}`} />
                          {customer.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3 flex-shrink-0" /> 
                          <span className="truncate">{customer.phone}</span>
                        </div>
                        {(customer.village || customer.taluka || customer.district) && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" /> 
                            <span className="truncate">
                              {[customer.village, customer.taluka, customer.district].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t flex justify-between items-center gap-2">
                        <select 
                          value={customer.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(customer._id, e.target.value);
                          }}
                          className="text-xs border rounded px-2 py-1 bg-background"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="sm" onClick={() => handleCustomerClick(customer)}>
                            {language === 'te' ? 'వీక్షించండి' : language === 'hi' ? 'देखें' : 'View'}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(customer._id)}>
                            {language === 'te' ? 'తొలగించు' : language === 'hi' ? 'हटाएं' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Customer Details */}
        <div className="lg:col-span-1">
          {selectedCustomer ? (
            <div className="space-y-6">
              {/* Customer Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {language === 'te' ? 'కస్టమర్ వివరాలు' : language === 'hi' ? 'ग्राहक विवरण' : 'Customer Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedCustomer.name || selectedCustomer.username}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedCustomer.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(selectedCustomer.status)}`} />
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    {selectedCustomer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                    )}
                    {(selectedCustomer.village || selectedCustomer.taluka || selectedCustomer.district) && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>
                          {[selectedCustomer.village, selectedCustomer.taluka, selectedCustomer.district].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Milk className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {language === 'te' ? 'మొత్తం పాలు' : language === 'hi' ? 'कुल दूध' : 'Total Milk'}
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{totalMilk.toFixed(1)} L</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      {language === 'te' ? 'మొత్తం' : language === 'hi' ? 'कुल' : 'Total'}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">₹{totalAmount.toFixed(0)}</p>
                </Card>
              </div>

              {/* Payment Stats */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <p className="font-semibold">
                    {language === 'te' ? 'చెల్లింపు స్థితి' : language === 'hi' ? 'भुगतान स्थिति' : 'Payment Status'}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'te' ? 'చెల్లించబడింది' : language === 'hi' ? 'भुगतान किया' : 'Paid'}
                    </span>
                    <span className="font-semibold text-green-600">₹{paid.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'te' ? 'తీసుకోవాలి' : language === 'hi' ? 'बकाया' : 'Pending'}
                    </span>
                    <span className="font-semibold text-yellow-600">₹{pending.toFixed(0)}</span>
                  </div>
                  <Progress 
                    value={totalAmount > 0 ? (paid / totalAmount) * 100 : 0} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {totalAmount > 0 ? ((paid / totalAmount) * 100).toFixed(0) : 0}% {language === 'te' ? 'చెల్లించబడింది' : language === 'hi' ? 'भुगतान किया' : 'paid'}
                  </p>
                </div>
              </Card>

              {/* Weekly Milk Chart */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <p className="font-semibold">
                    {language === 'te' ? 'ఈ వారం పాలు' : language === 'hi' ? 'इस सप्ताह दूध' : 'This Week Milk'}
                  </p>
                </div>
                <div className="space-y-2">
                  {last7DaysMilk.map((day, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-8">{day.date}</span>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${(day.milk / maxMilk) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-12 text-right">{day.milk.toFixed(1)}L</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Milk Entries */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {language === 'te' ? 'ఇటీవలి ఎంట్రీలు' : language === 'hi' ? 'हाल की प्रविष्टियां' : 'Recent Entries'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customerLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : customerMilkData.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {customerMilkData.slice(0, 10).map((entry: any) => (
                        <div 
                          key={entry._id} 
                          className="flex justify-between items-center p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Milk className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{format(new Date(entry.date), 'dd MMM')}</p>
                              <p className="text-xs text-muted-foreground">
                                {entry.timeOfDay === 'morning' 
                                  ? (language === 'te' ? 'ఉదయం' : language === 'hi' ? 'सुबह' : 'Morning') 
                                  : (language === 'te' ? 'సాయంత్రం' : language === 'hi' ? 'शाम' : 'Evening')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">{entry.quantity}L</p>
                            <p className="text-xs text-muted-foreground">₹{entry.totalAmount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      {language === 'te' ? 'ఎంట్రీలు లేవు' : language === 'hi' ? 'कोई प्रविष्टियां नहीं' : 'No milk entries'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center h-full flex flex-col items-center justify-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'te' ? 'కస్టమర్‌ని ఎంచుకోండి' : language === 'hi' ? 'ग्राहक चुनें' : 'Select a Customer'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {language === 'te' 
                  ? 'కస్టమర్ వివరాలు చూడటానికి ఎడమ వైపు ఉన్న కస్టమర్‌ల జాబిల్లి నుండి ఒక కస్టమర్‌ని ఎంచుకోండి' 
                  : language === 'hi' 
                  ? 'विवरण देखने के लिए बाईं ओर सूची से एक ग्राहक चुनें' 
                  : 'Select a customer from the list on the left to view their details'}
              </p>
            </Card>
          )}
        </div>
      </div>
=======
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {language === 'te' ? 'కస్టమర్లు' : language === 'hi' ? 'ग्राहक' : 'Customers'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'te' ? 'కస్టమర్లను నిర్వహించండి' : language === 'hi' ? 'ग्राहकों का प्रबंधन करें' : 'Manage your customers'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchCustomers}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="btn-golden">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'te' ? 'జోడించు' : language === 'hi' ? 'जोड़ें' : 'Add Customer'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer 
                    ? (language === 'te' ? 'కస్టమర్ ఎడిట్' : language === 'hi' ? 'ग्राहक संपादित करें' : 'Edit Customer')
                    : (language === 'te' ? 'కొత్త కస్టమర్' : language === 'hi' ? 'नया ग्राहक' : 'New Customer')}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                    placeholder="Address (optional)"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subscription</Label>
                    <Select 
                      value={formData.subscription_type} 
                      onValueChange={(v) => setFormData(p => ({ ...p, subscription_type: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="alternate">Alternate</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Qty (L)</Label>
                    <Input
                      type="number"
                      step="0.25"
                      min="0.25"
                      value={formData.default_quantity}
                      onChange={(e) => setFormData(p => ({ ...p, default_quantity: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving} className="btn-golden">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingCustomer ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'te' ? 'పేరు లేదా ఫోన్ ద్వారా శోధించండి...' : 'Search by name or phone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {filteredCustomers.length} {language === 'te' ? 'కస్టమర్లు' : 'Customers'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Default Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{customer.subscription_type}</Badge>
                      </TableCell>
                      <TableCell>{customer.default_quantity}L</TableCell>
                      <TableCell>
                        <Badge variant={customer.is_active ? "default" : "secondary"}>
                          {customer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(customer.created_at), 'dd MMM yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleActive(customer)}
                            title={customer.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {customer.is_active ? <ToggleRight className="h-4 w-4 text-primary" /> : <ToggleLeft className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(customer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {customer.name} and all their records.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteCustomer(customer.id)} className="bg-destructive">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
>>>>>>> f414d65a214657a245744ac85122315c6e4af3e1
    </div>
  );
};

export default CustomersPage;
