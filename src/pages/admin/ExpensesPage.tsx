<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Receipt, Plus, Edit, Trash2, Loader2, RefreshCw,
  Calendar, IndianRupee, Filter
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

interface ExpenseCategory {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  category_id: string | null;
  amount: number;
  description: string;
  expense_date: string;
  vendor: string | null;
  created_at: string;
  expense_categories: ExpenseCategory | null;
}

const ExpensesPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    description: '',
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    vendor: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    
    const [expensesRes, categoriesRes] = await Promise.all([
      supabase.from('expenses').select('*, expense_categories(id, name)').order('expense_date', { ascending: false }),
      supabase.from('expense_categories').select('*').order('name')
    ]);

    if (expensesRes.error) {
      toast({ variant: 'destructive', title: 'Error', description: expensesRes.error.message });
    } else {
      setExpenses(expensesRes.data || []);
    }

    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExpenses = expenses.filter(e => 
    categoryFilter === 'all' || e.category_id === categoryFilter
  );

  const resetForm = () => {
    setFormData({
      category_id: '',
      amount: '',
      description: '',
      expense_date: format(new Date(), 'yyyy-MM-dd'),
      vendor: ''
    });
    setEditingExpense(null);
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      category_id: expense.category_id || '',
      amount: String(expense.amount),
      description: expense.description,
      expense_date: expense.expense_date,
      vendor: expense.vendor || ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.amount || !formData.description.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Amount and description are required' });
      return;
    }

    setIsSaving(true);

    const expenseData = {
      category_id: formData.category_id || null,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      expense_date: formData.expense_date,
      vendor: formData.vendor.trim() || null
    };

    let error;
    if (editingExpense) {
      ({ error } = await supabase.from('expenses').update(expenseData).eq('id', editingExpense.id));
    } else {
      ({ error } = await supabase.from('expenses').insert(expenseData));
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success!', description: editingExpense ? 'Expense updated' : 'Expense added' });
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    }
    setIsSaving(false);
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Deleted', description: 'Expense removed successfully' });
      fetchData();
    }
  };

  // Stats
  const totalThisMonth = expenses
    .filter(e => {
      const expenseDate = new Date(e.expense_date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalAll = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category_id === cat.id).reduce((sum, e) => sum + Number(e.amount), 0)
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            {language === 'te' ? 'ఖర్చులు' : language === 'hi' ? 'खर्च' : 'Expenses'}
          </h1>
          <p className="text-muted-foreground mt-1">Track farm expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="btn-golden">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={formData.category_id} 
                      onValueChange={(v) => setFormData(p => ({ ...p, category_id: v }))}
                    >
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (₹) *</Label>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="What was this expense for?"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.expense_date}
                      onChange={(e) => setFormData(p => ({ ...p, expense_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor</Label>
                    <Input
                      value={formData.vendor}
                      onChange={(e) => setFormData(p => ({ ...p, vendor: e.target.value }))}
                      placeholder="Vendor name"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving} className="btn-golden">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingExpense ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold text-primary">₹{totalThisMonth.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">₹{totalAll.toLocaleString()}</p>
          </CardContent>
        </Card>
        {categoryTotals.slice(0, 2).map(cat => (
          <Card key={cat.id}>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">{cat.name}</p>
              <p className="text-2xl font-bold">₹{cat.total.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{filteredExpenses.length} Expenses</CardTitle>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(expense.expense_date), 'dd MMM yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {expense.expense_categories?.name || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{expense.description}</TableCell>
                      <TableCell>{expense.vendor || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold text-destructive">
                          <IndianRupee className="h-3 w-3" />
                          {Number(expense.amount).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(expense)}>
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
                                <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this expense record.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteExpense(expense.id)} className="bg-destructive">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredExpenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No expenses found
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

export default ExpensesPage;
