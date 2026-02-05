<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Plus, AlertTriangle, Truck, Box, Search } from "lucide-react";
import { getInventory, getInventoryStats, addInventoryItem, deleteInventoryItem } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { AddInventoryDialog } from "@/components/admin/AddInventoryDialog";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  minQuantity?: number;
  price?: number;
  supplier?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  location?: string;
  createdAt: string;
}

interface InventoryStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

const InventoryPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryData, inventoryStats] = await Promise.all([
          getInventory(),
          getInventoryStats()
        ]);
        setInventory(inventoryData);
        setStats(inventoryStats);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 bg-green/10';
      case 'low-stock': return 'text-yellow-600 bg-yellow/10';
      case 'out-of-stock': return 'text-red-600 bg-red/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteInventoryItem(id);
      // Refetch data to ensure consistency
      const fetchData = async () => {
        try {
          const [inventoryData, inventoryStats] = await Promise.all([
            getInventory(),
            getInventoryStats()
          ]);
          setInventory(inventoryData);
          setStats(inventoryStats);
        } catch (error) {
          console.error('Failed to fetch inventory:', error);
        }
      };
      await fetchData();
      toast({ title: "Success", description: "Item deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete item" });
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {language === 'te' ? 'ఇన్వెంటరీ' : language === 'hi' ? 'इन्वेंटरी' : 'Inventory'}
        </h1>
        <AddInventoryDialog onInventoryAdded={() => {
          const fetchData = async () => {
            try {
              const [inventoryData, inventoryStats] = await Promise.all([
                getInventory(),
                getInventoryStats()
              ]);
              setInventory(inventoryData);
              setStats(inventoryStats);
            } catch (error) {
              console.error('Failed to fetch inventory:', error);
            }
          };
          fetchData();
        }} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'మొత్తం అంశాలు' : language === 'hi' ? 'कुल आइटम' : 'Total Items'}
              </p>
              <p className="text-xl font-bold">{inventory.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green/10 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'ఉంది' : language === 'hi' ? 'उपलब्ध' : 'In Stock'}
              </p>
              <p className="text-xl font-bold text-green-600">
                {inventory.filter(i => i.status === 'in-stock').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'తక్కువ స్టాక్' : language === 'hi' ? 'कम स्टॉक' : 'Low Stock'}
              </p>
              <p className="text-xl font-bold text-yellow-600">
                {inventory.filter(i => i.status === 'low-stock').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue/10 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'మొత్తం విలువ' : language === 'hi' ? 'कुल मूल्य' : 'Total Value'}
              </p>
              <p className="text-xl font-bold text-blue-600">
                ₹{stats?.totalValue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={language === 'te' ? 'పేరు లేదా వర్గం ద్వారా శోధించండి' : 
                       language === 'hi' ? 'नाम या श्रेणी से खोजें' : 
                       'Search by name or category...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => (
          <Card key={item._id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber/10 rounded-full">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'వర్గం' : 'Category'}: {item.category}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'పరిమాణం' : 'Quantity'}: {item.quantity} {item.unit}
                  </p>
                  {item.supplier && (
                    <p className="text-muted-foreground">
                      {language === 'te' ? 'సరఫరాదారు' : 'Supplier'}: {item.supplier}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center gap-2">
                  <Button variant="outline" size="sm">
                    {language === 'te' ? 'సవరించు' : 'Edit'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>
                    {language === 'te' ? 'తొలగించు' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {language === 'te' ? 'ఇన్వెంటరీ అంశాలు లేవు' : 
             language === 'hi' ? 'कोई इन्वेंटरी आइटम नहीं' : 
             'No inventory items found'}
          </p>
        </Card>
      )}
=======
import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Edit, Trash2, Loader2, RefreshCw, AlertTriangle
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

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  price_per_unit: number | null;
  supplier: string | null;
  notes: string | null;
}

const InventoryPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'general',
    unit: 'kg',
    current_stock: '',
    minimum_stock: '10',
    price_per_unit: '',
    supplier: '',
    notes: ''
  });

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setItems(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'general',
      unit: 'kg',
      current_stock: '',
      minimum_stock: '10',
      price_per_unit: '',
      supplier: '',
      notes: ''
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      current_stock: String(item.current_stock),
      minimum_stock: String(item.minimum_stock),
      price_per_unit: item.price_per_unit?.toString() || '',
      supplier: item.supplier || '',
      notes: item.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name is required' });
      return;
    }

    setIsSaving(true);

    const itemData = {
      name: formData.name.trim(),
      category: formData.category,
      unit: formData.unit,
      current_stock: parseFloat(formData.current_stock) || 0,
      minimum_stock: parseFloat(formData.minimum_stock) || 10,
      price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit) : null,
      supplier: formData.supplier.trim() || null,
      notes: formData.notes.trim() || null
    };

    let error;
    if (editingItem) {
      ({ error } = await supabase.from('inventory_items').update(itemData).eq('id', editingItem.id));
    } else {
      ({ error } = await supabase.from('inventory_items').insert(itemData));
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success!', description: editingItem ? 'Item updated' : 'Item added' });
      setIsDialogOpen(false);
      resetForm();
      fetchItems();
    }
    setIsSaving(false);
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('inventory_items').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Deleted', description: 'Item removed successfully' });
      fetchItems();
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    const { error } = await supabase
      .from('inventory_items')
      .update({ current_stock: newStock })
      .eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      fetchItems();
    }
  };

  // Stats
  const lowStockItems = items.filter(i => i.current_stock < i.minimum_stock);
  const totalValue = items.reduce((sum, i) => sum + (i.current_stock * (i.price_per_unit || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            {language === 'te' ? 'ఇన్వెంటరీ' : language === 'hi' ? 'इन्वेंटरी' : 'Inventory'}
          </h1>
          <p className="text-muted-foreground mt-1">Manage stock and supplies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchItems}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="btn-golden">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Item name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feed">Feed</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="medicine">Medicine</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select 
                      value={formData.unit} 
                      onValueChange={(v) => setFormData(p => ({ ...p, unit: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="pcs">Pieces</SelectItem>
                        <SelectItem value="bales">Bales</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Stock</Label>
                    <Input
                      type="number"
                      value={formData.current_stock}
                      onChange={(e) => setFormData(p => ({ ...p, current_stock: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Stock</Label>
                    <Input
                      type="number"
                      value={formData.minimum_stock}
                      onChange={(e) => setFormData(p => ({ ...p, minimum_stock: e.target.value }))}
                      placeholder="10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price per Unit (₹)</Label>
                    <Input
                      type="number"
                      value={formData.price_per_unit}
                      onChange={(e) => setFormData(p => ({ ...p, price_per_unit: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Input
                      value={formData.supplier}
                      onChange={(e) => setFormData(p => ({ ...p, supplier: e.target.value }))}
                      placeholder="Supplier name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving} className="btn-golden">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingItem ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </CardContent>
        </Card>
        <Card className={lowStockItems.length > 0 ? 'border-destructive/50' : ''}>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {lowStockItems.length > 0 && <AlertTriangle className="h-4 w-4 text-destructive" />}
              Low Stock
            </p>
            <p className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-destructive' : ''}`}>
              {lowStockItems.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <Badge key={item.id} variant="destructive">
                  {item.name}: {item.current_stock} {item.unit} (min: {item.minimum_stock})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{items.length} Inventory Items</CardTitle>
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
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Min Level</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => {
                    const isLow = item.current_stock < item.minimum_stock;
                    return (
                      <TableRow key={item.id} className={isLow ? 'bg-destructive/5' : ''}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              className="w-20 h-8"
                              value={item.current_stock}
                              onChange={(e) => updateStock(item.id, parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-muted-foreground">{item.unit}</span>
                            {isLow && <AlertTriangle className="h-4 w-4 text-destructive" />}
                          </div>
                        </TableCell>
                        <TableCell>{item.minimum_stock} {item.unit}</TableCell>
                        <TableCell>{item.supplier || '-'}</TableCell>
                        <TableCell>
                          {item.price_per_unit 
                            ? `₹${(item.current_stock * item.price_per_unit).toLocaleString()}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
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
                                  <AlertDialogTitle>Delete Item?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete {item.name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteItem(item.id)} className="bg-destructive">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No inventory items found
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

export default InventoryPage;
