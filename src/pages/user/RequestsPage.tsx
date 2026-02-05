import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Calendar, Package, MessageSquare, Plus, CheckCircle, XCircle } from "lucide-react";

interface Request {
  _id: string;
  type: 'delivery' | 'pause' | 'quantity' | 'query';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const RequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([
    { _id: '1', type: 'delivery', title: 'Change Delivery Time', description: 'Change from 6 AM to 7 AM', status: 'pending', date: '2024-02-01' },
    { _id: '2', type: 'pause', title: 'Pause Subscription', description: 'Vacation hold for 5 days', status: 'approved', date: '2024-01-28' },
  ]);
  const [showForm, setShowForm] = useState(false);

  const requestTypes = [
    { type: 'delivery', icon: Clock, label: 'Change Delivery Time' },
    { type: 'pause', icon: Calendar, label: 'Pause Subscription' },
    { type: 'quantity', icon: Package, label: 'Change Quantity' },
    { type: 'query', icon: MessageSquare, label: 'General Query' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow/10';
      case 'approved': return 'text-green-600 bg-green/10';
      case 'rejected': return 'text-red-600 bg-red/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Requests</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Request Form */}
      {showForm && (
        <Card className="p-4 space-y-4">
          <h2 className="font-semibold">Create New Request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {requestTypes.map((rt) => (
              <Button
                key={rt.type}
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => {
                  // Handle request type selection
                  setShowForm(false);
                }}
              >
                <rt.icon className="h-5 w-5 mr-2" />
                {rt.label}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Pending Requests */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          Pending Requests
        </h2>
        <div className="space-y-2">
          {requests.filter(r => r.status === 'pending').map((request) => (
            <Card key={request._id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow/10 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </Card>
          ))}
          {requests.filter(r => r.status === 'pending').length === 0 && (
            <p className="text-muted-foreground">No pending requests</p>
          )}
        </div>
      </div>

      {/* Processed Requests */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Processed Requests
        </h2>
        <div className="space-y-2">
          {requests.filter(r => r.status !== 'pending').map((request) => (
            <Card key={request._id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    request.status === 'approved' ? 'bg-green/10' : 'bg-red/10'
                  }`}>
                    {request.status === 'approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </Card>
          ))}
          {requests.filter(r => r.status !== 'pending').length === 0 && (
            <p className="text-muted-foreground">No processed requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
