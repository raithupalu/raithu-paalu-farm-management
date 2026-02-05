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
        </Card>
      </div>

      {/* Filters */}
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
    </div>
  );
};

export default LogsPage;
