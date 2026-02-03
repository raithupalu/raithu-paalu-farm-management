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
        </Card>
      </div>

      {/* Filters */}
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
    </div>
  );
};

export default LogsPage;
