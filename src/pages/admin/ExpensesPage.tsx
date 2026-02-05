import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Receipt, Plus, DollarSign, Calendar, TrendingUp, Search } from "lucide-react";
import { getExpenses, getExpenseStats, addExpense, updateExpense, deleteExpense } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { AddExpenseDialog } from "@/components/admin/AddExpenseDialog";

interface Expense {
  _id: string;
  category: string;
  subCategory?: string;
  description: string;
  amount: number;
  quantity?: number;
  unit?: string;
  vendor?: string;
  date: string;
  status: 'pending' | 'approved' | 'paid' | string;
  paymentMode?: string;
  createdBy?: { _id: string; name: string };
}

interface ExpenseStats {
  total: number;
  thisMonth: number;
  today: number;
  pending: number;
  byCategory: { _id: string; total: number }[];
}

const ExpensesPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseData, expenseStats] = await Promise.all([
          getExpenses(),
          getExpenseStats()
        ]);
        setExpenses(expenseData);
        setStats(expenseStats);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch expenses",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const categories = ['Feed', 'Medicine', 'Labor', 'Equipment', 'Utilities', 'Maintenance', 'Transportation', 'Other'];

  const filteredExpenses = expenses.filter(e =>
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Feed': return 'bg-amber/10 text-amber-600';
      case 'Medicine': return 'bg-red/10 text-red-600';
      case 'Labor': return 'bg-blue/10 text-blue-600';
      case 'Equipment': return 'bg-purple/10 text-purple-600';
      case 'Utilities': return 'bg-green/10 text-green-600';
      case 'Maintenance': return 'bg-orange/10 text-orange-600';
      case 'Transportation': return 'bg-indigo/10 text-indigo-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green/10';
      case 'approved': return 'text-blue-600 bg-blue/10';
      case 'pending': return 'text-yellow-600 bg-yellow/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateExpense(id, { status: newStatus });
      setExpenses(expenses.map(e => e._id === id ? { ...e, status: newStatus } : e));
      toast({ title: "Success", description: "Expense status updated" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      await deleteExpense(id);
      // Refetch data to ensure consistency
      const fetchData = async () => {
        try {
          const [expenseData, expenseStats] = await Promise.all([
            getExpenses(),
            getExpenseStats()
          ]);
          setExpenses(expenseData);
          setStats(expenseStats);
        } catch (error) {
          console.error('Failed to fetch expenses:', error);
        }
      };
      await fetchData();
      toast({ title: "Success", description: "Expense deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete expense" });
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {language === 'te' ? 'ఖర్చులు' : language === 'hi' ? 'खर्च' : 'Expenses'}
        </h1>
        <AddExpenseDialog onExpenseAdded={() => {
          const fetchData = async () => {
            try {
              const [expenseData, expenseStats] = await Promise.all([
                getExpenses(),
                getExpenseStats()
              ]);
              setExpenses(expenseData);
              setStats(expenseStats);
            } catch (error) {
              console.error('Failed to fetch expenses', error);
            }
          };
          fetchData();
        }} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red/10 rounded-lg">
              <Receipt className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">₹{stats?.total?.toLocaleString() || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow/10 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-yellow-600">₹{stats?.pending?.toLocaleString() || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-xl font-bold">₹{stats?.thisMonth?.toLocaleString() || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Expenses</p>
              <p className="text-xl font-bold text-blue-600">₹{stats?.today?.toLocaleString() || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {stats?.byCategory?.map((cat) => (
          <div key={cat._id} className={`p-3 rounded-lg ${getCategoryColor(cat._id)}`}>
            <p className="text-xs font-medium">{cat._id}</p>
            <p className="text-lg font-bold">₹{cat.total.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={language === 'te' ? 'ఖర్చులను శోధించండి' : 
                       language === 'hi' ? 'खर्च खोजें' : 
                       'Search expenses...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        {filteredExpenses.map((expense) => (
          <Card key={expense._id} className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(expense.category)}`}>
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">₹{expense.amount.toLocaleString()}</span>
                <select
                  value={expense.status}
                  onChange={(e) => handleStatusChange(expense._id, e.target.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                </select>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(expense._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpensesPage;
