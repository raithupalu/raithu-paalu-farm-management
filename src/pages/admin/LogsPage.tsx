<<<<<<< HEAD
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClipboardList, Activity, AlertTriangle, User, Clock, Search, Filter, Download } from "lucide-react";

interface Log {
  _id: string;
  action: string;
  user: string;
  type: 'info' | 'warning' | 'error' | 'success';
  description: string;
  timestamp: string;
}

const LogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState('all');

  const [logs] = useState<Log[]>([
    { _id: '1', action: 'User Login', user: 'Admin', type: 'success', description: 'Successful login from IP 192.168.1.1', timestamp: '2024-02-02 10:30:15' },
    { _id: '2', action: 'Milk Entry Added', user: 'Admin', type: 'info', description: 'Added 45L morning milk entry', timestamp: '2024-02-02 08:15:00' },
    { _id: '3', action: 'New Order', user: 'System', type: 'info', description: 'New order #1234 received from Ramesh', timestamp: '2024-02-02 07:45:22' },
    { _id: '4', action: 'Low Stock Alert', user: 'System', type: 'warning', description: 'Feed inventory below reorder level', timestamp: '2024-02-02 06:00:00' },
    { _id: '5', action: 'Payment Received', user: 'System', type: 'success', description: 'Payment of ₹200 received from Suresh', timestamp: '2024-02-01 22:30:45' },
    { _id: '6', action: 'Subscription Update', user: 'Customer', type: 'info', description: 'Mahesh paused subscription for 5 days', timestamp: '2024-02-01 18:20:10' },
    { _id: '7', action: 'Database Backup', user: 'System', type: 'info', description: 'Automatic daily backup completed', timestamp: '2024-02-01 00:00:00' },
    { _id: '8', action: 'Failed Login', user: 'Unknown', type: 'error', description: 'Failed login attempt from IP 192.168.1.100', timestamp: '2024-01-31 23:45:30' },
  ]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || log.type === filter;
    return matchesSearch && matchesFilter;
  });

  const logCounts = {
    info: logs.filter(l => l.type === 'info').length,
    warning: logs.filter(l => l.type === 'warning').length,
    error: logs.filter(l => l.type === 'error').length,
    success: logs.filter(l => l.type === 'success').length,
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-600 bg-blue/10';
      case 'warning': return 'text-yellow-600 bg-yellow/10';
      case 'error': return 'text-red-600 bg-red/10';
      case 'success': return 'text-green-600 bg-green/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'success': return <Activity className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue/10 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Info</p>
              <p className="text-xl font-bold text-blue-600">{logCounts.info}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-xl font-bold text-yellow-600">{logCounts.warning}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Errors</p>
              <p className="text-xl font-bold text-red-600">{logCounts.error}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green/10 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success</p>
              <p className="text-xl font-bold text-green-600">{logCounts.success}</p>
            </div>
          </div>
=======
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  ClipboardList, Loader2, RefreshCw, Filter, User, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_values: any;
  new_values: any;
  created_at: string;
}

const LogsPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [tableFilter, setTableFilter] = useState<string>('all');

  const fetchLogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setLogs(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    (actionFilter === 'all' || log.action === actionFilter) &&
    (tableFilter === 'all' || log.table_name === tableFilter)
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case 'INSERT': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'UPDATE': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'DELETE': return 'bg-red-500/10 text-red-600 border-red-500/30';
      default: return '';
    }
  };

  const getTableLabel = (table: string) => {
    const labels: Record<string, string> = {
      customers: 'Customers',
      milk_entries: 'Milk Entries',
      orders: 'Orders',
      expenses: 'Expenses',
      buffaloes: 'Buffaloes',
      inventory_items: 'Inventory'
    };
    return labels[table] || table;
  };

  const formatChanges = (action: string, oldValues: any, newValues: any) => {
    if (action === 'INSERT') {
      const name = newValues?.name || newValues?.description || 'New record';
      return <span className="text-green-600">Created: {name}</span>;
    }
    if (action === 'DELETE') {
      const name = oldValues?.name || oldValues?.description || 'Record';
      return <span className="text-destructive">Deleted: {name}</span>;
    }
    if (action === 'UPDATE' && oldValues && newValues) {
      const changes: string[] = [];
      Object.keys(newValues).forEach(key => {
        if (key !== 'updated_at' && oldValues[key] !== newValues[key]) {
          changes.push(`${key}: ${oldValues[key]} → ${newValues[key]}`);
        }
      });
      return changes.length > 0 
        ? <span className="text-blue-600">{changes.slice(0, 2).join(', ')}</span>
        : <span className="text-muted-foreground">No visible changes</span>;
    }
    return <span className="text-muted-foreground">-</span>;
  };

  // Get unique tables for filter
  const uniqueTables = [...new Set(logs.map(l => l.table_name))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            {language === 'te' ? 'ఆడిట్ లాగ్‌లు' : language === 'hi' ? 'ऑडिट लॉग' : 'Audit Logs'}
          </h1>
          <p className="text-muted-foreground mt-1">Track all system activities</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchLogs}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Logs</p>
            <p className="text-2xl font-bold">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Creates</p>
            <p className="text-2xl font-bold text-green-600">
              {logs.filter(l => l.action === 'INSERT').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Updates</p>
            <p className="text-2xl font-bold text-blue-600">
              {logs.filter(l => l.action === 'UPDATE').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-red-500/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Deletes</p>
            <p className="text-2xl font-bold text-destructive">
              {logs.filter(l => l.action === 'DELETE').length}
            </p>
          </CardContent>
>>>>>>> f414d65a214657a245744ac85122315c6e4af3e1
        </Card>
      </div>

      {/* Filters */}
<<<<<<< HEAD
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'info', 'warning', 'error', 'success'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-2">
        {filteredLogs.map((log) => (
          <Card key={log._id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                {getTypeIcon(log.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-muted-foreground">{log.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {log.user}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {log.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No logs found</p>
          </div>
        )}
      </div>
=======
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="INSERT">Creates</SelectItem>
                <SelectItem value="UPDATE">Updates</SelectItem>
                <SelectItem value="DELETE">Deletes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                {uniqueTables.map(table => (
                  <SelectItem key={table} value={table}>{getTableLabel(table)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{filteredLogs.length} Log Entries</CardTitle>
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
                    <TableHead>Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Changes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {format(new Date(log.created_at), 'dd MMM, hh:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionColor(log.action)} variant="outline">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getTableLabel(log.table_name)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {formatChanges(log.action, log.old_values, log.new_values)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No logs found
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

export default LogsPage;
