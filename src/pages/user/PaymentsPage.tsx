import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { getPayments } from '@/services/api';

interface Payment {
  _id: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

const PaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPayments({ userId: user?._id });
        setPayments(res);
      } catch (err) {
        console.error('Failed to load payments', err);
      }
    };
    load();
  }, [user?._id]);

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const completedPayments = payments.filter(p => p.status === 'completed');

  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow/10 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-yellow-600">₹{totalPending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid (This Month)</p>
              <p className="text-xl font-bold text-green-600">₹{totalPaid}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-xl font-bold">{payments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Pending Payments
          </h2>
          <div className="space-y-2">
            {pendingPayments.map((payment) => (
              <Card key={payment._id} className="p-4 border-yellow/20 bg-yellow/5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-muted-foreground">Due: {payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-yellow-600">₹{payment.amount}</p>
                    <Button size="sm" className="mt-1">
                      Pay Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Payment History
        </h2>
        <div className="space-y-2">
          {completedPayments.length === 0 ? (
            <p className="text-muted-foreground">No payment history</p>
          ) : (
            completedPayments.map((payment) => (
              <Card key={payment._id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green/10 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">₹{payment.amount}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
