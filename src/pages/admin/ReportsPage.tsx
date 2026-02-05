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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 Days
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

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
    </div>
  );
};

export default ReportsPage;
