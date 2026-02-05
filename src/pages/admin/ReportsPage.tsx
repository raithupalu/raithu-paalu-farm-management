<<<<<<< HEAD
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Milk, Users, Download, Calendar } from "lucide-react";

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('week');

  const stats = {
    revenue: { value: '₹45,600', change: '+12%', trend: 'up' },
    orders: { value: '156', change: '+8%', trend: 'up' },
    milkProduction: { value: '2,450L', change: '-2%', trend: 'down' },
    customers: { value: '45', change: '+5%', trend: 'up' },
  };

  const recentReports = [
    { id: '1', name: 'Weekly Sales Report', date: '2024-02-02', type: 'sales' },
    { id: '2', name: 'Monthly Financial Summary', date: '2024-02-01', type: 'financial' },
    { id: '3', name: 'Milk Production Analysis', date: '2024-01-28', type: 'production' },
    { id: '4', name: 'Customer Growth Report', date: '2024-01-25', type: 'customers' },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
=======
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { 
  FileText, Download, Loader2, RefreshCw, TrendingUp, TrendingDown,
  IndianRupee, Milk, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const ReportsPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [stats, setStats] = useState({
    totalMilk: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    activeCustomers: 0,
    pendingPayments: 0,
    deliveryDays: 0
  });

  const fetchReportData = async () => {
    setIsLoading(true);
    
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = format(startOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');

    try {
      const [milkRes, expensesRes, ordersRes, customersRes] = await Promise.all([
        supabase
          .from('milk_entries')
          .select('quantity_liters, total_amount')
          .gte('entry_date', startDate)
          .lte('entry_date', endDate),
        supabase
          .from('expenses')
          .select('amount')
          .gte('expense_date', startDate)
          .lte('expense_date', endDate),
        supabase
          .from('orders')
          .select('total_amount, payment_status')
          .gte('order_date', startDate)
          .lte('order_date', endDate),
        supabase
          .from('customers')
          .select('id')
          .eq('is_active', true)
      ]);

      const milkEntries = milkRes.data || [];
      const expenses = expensesRes.data || [];
      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];

      // Get unique delivery days
      const uniqueDays = new Set(milkEntries.map(e => e.quantity_liters > 0 ? 1 : 0));

      setStats({
        totalMilk: milkEntries.reduce((sum, e) => sum + Number(e.quantity_liters), 0),
        totalRevenue: milkEntries.reduce((sum, e) => sum + Number(e.total_amount), 0) +
                      orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_amount), 0),
        totalExpenses: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
        activeCustomers: customers.length,
        pendingPayments: orders.filter(o => o.payment_status !== 'paid').reduce((sum, o) => sum + Number(o.total_amount), 0),
        deliveryDays: milkEntries.length
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load report data' });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth]);

  const profit = stats.totalRevenue - stats.totalExpenses;
  const profitMargin = stats.totalRevenue > 0 ? (profit / stats.totalRevenue) * 100 : 0;

  // Generate month options for last 12 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    };
  });

  const exportReport = () => {
    const reportData = `
DAIRY FARM MONTHLY REPORT
=========================
Period: ${monthOptions.find(m => m.value === selectedMonth)?.label}

SUMMARY
-------
Total Milk Delivered: ${stats.totalMilk.toFixed(2)} Liters
Total Revenue: ₹${stats.totalRevenue.toLocaleString()}
Total Expenses: ₹${stats.totalExpenses.toLocaleString()}
Net Profit: ₹${profit.toLocaleString()}
Profit Margin: ${profitMargin.toFixed(1)}%

OPERATIONS
----------
Active Customers: ${stats.activeCustomers}
Delivery Days: ${stats.deliveryDays}
Pending Payments: ₹${stats.pendingPayments.toLocaleString()}

Generated on: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}
    `.trim();

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dairy-report-${selectedMonth}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Report Downloaded', description: 'Report exported successfully' });
>>>>>>> f414d65a214657a245744ac85122315c6e4af3e1
  };

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 Days
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Export
=======
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {language === 'te' ? 'రిపోర్ట్‌లు' : language === 'hi' ? 'रिपोर्ट' : 'Reports'}
          </h1>
          <p className="text-muted-foreground mt-1">Monthly business reports and analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchReportData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={exportReport} className="btn-golden">
            <Download className="h-4 w-4 mr-2" />
            Export
>>>>>>> f414d65a214657a245744ac85122315c6e4af3e1
          </Button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            {getTrendIcon(stats.revenue.trend)}
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-2xl font-bold">{stats.revenue.value}</p>
            <p className="text-sm text-green-600">{stats.revenue.change} vs last period</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            {getTrendIcon(stats.orders.trend)}
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">Orders</p>
            <p className="text-2xl font-bold">{stats.orders.value}</p>
            <p className="text-sm text-green-600">{stats.orders.change} vs last period</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber/10 rounded-lg">
              <Milk className="h-5 w-5 text-amber-600" />
            </div>
            {getTrendIcon(stats.milkProduction.trend)}
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">Milk Production</p>
            <p className="text-2xl font-bold">{stats.milkProduction.value}</p>
            <p className="text-sm text-red-600">{stats.milkProduction.change} vs last period</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            {getTrendIcon(stats.customers.trend)}
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">New Customers</p>
            <p className="text-2xl font-bold">{stats.customers.value}</p>
            <p className="text-sm text-green-600">{stats.customers.change} vs last period</p>
          </div>
        </Card>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Sales Report', icon: DollarSign, color: 'green' },
          { name: 'Financial Summary', icon: FileText, color: 'blue' },
          { name: 'Production Analysis', icon: Milk, color: 'amber' },
          { name: 'Customer Report', icon: Users, color: 'purple' },
        ].map((report) => (
          <Card key={report.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${report.color}/10 rounded-lg`}>
                <report.icon className={`h-5 w-5 text-${report.color}-600`} />
              </div>
              <div>
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-muted-foreground">Generate report</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4">Recent Reports</h2>
        <div className="space-y-2">
          {recentReports.map((report) => (
            <div key={report.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
=======
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <IndianRupee className="h-4 w-4" />
                  <span className="text-sm">Total Revenue</span>
                </div>
                <p className="text-2xl font-bold text-primary">₹{stats.totalRevenue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-destructive/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm">Total Expenses</span>
                </div>
                <p className="text-2xl font-bold text-destructive">₹{stats.totalExpenses.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className={profit >= 0 ? 'border-green-500/30' : 'border-destructive/30'}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  {profit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm">Net Profit</span>
                </div>
                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  ₹{profit.toLocaleString()}
                </p>
                <p className={`text-sm ${profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {profitMargin.toFixed(1)}% margin
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Milk className="h-4 w-4" />
                  <span className="text-sm">Total Milk</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalMilk.toFixed(2)}L</p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Customer Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Customers</span>
                  <span className="font-semibold">{stats.activeCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Days</span>
                  <span className="font-semibold">{stats.deliveryDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg per Customer</span>
                  <span className="font-semibold">
                    {stats.activeCustomers > 0 
                      ? (stats.totalMilk / stats.activeCustomers).toFixed(1) 
                      : 0}L
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Milk Sales</span>
                  <span className="font-semibold text-green-600">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Payments</span>
                  <span className="font-semibold text-yellow-600">
                    ₹{stats.pendingPayments.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Collection Rate</span>
                  <span className="font-semibold">
                    {stats.totalRevenue > 0 
                      ? (100 - (stats.pendingPayments / (stats.totalRevenue + stats.pendingPayments) * 100)).toFixed(1)
                      : 100}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Milk className="h-5 w-5 text-primary" />
                  Production Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Production</span>
                  <span className="font-semibold">{stats.totalMilk.toFixed(2)}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Average</span>
                  <span className="font-semibold">
                    {stats.deliveryDays > 0 
                      ? (stats.totalMilk / stats.deliveryDays).toFixed(2) 
                      : 0}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Price/Liter</span>
                  <span className="font-semibold">
                    ₹{stats.totalMilk > 0 
                      ? (stats.totalRevenue / stats.totalMilk).toFixed(2) 
                      : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
>>>>>>> f414d65a214657a245744ac85122315c6e4af3e1
    </div>
  );
};

export default ReportsPage;
