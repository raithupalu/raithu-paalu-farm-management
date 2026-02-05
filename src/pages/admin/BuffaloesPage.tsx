<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Milk, Plus, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { getBuffaloes, getBuffaloStats, addBuffalo, updateBuffalo, deleteBuffalo } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { AddBuffaloDialog } from "@/components/admin/AddBuffaloDialog";

interface Buffalo {
  _id: string;
  name: string;
  tagId?: string;
  breed?: string;
  age: number;
  weight: number;
  milkProduction: number;
  fatContent?: number;
  healthStatus: 'healthy' | 'sick' | 'pregnant' | 'dry' | string;
  lastVaccinationDate?: string;
  lastMilkDate?: string;
  assignedTo?: { _id: string; name: string; phone: string };
  createdAt: string;
}

interface BuffaloStats {
  total: number;
  healthy: number;
  sick: number;
  pregnant: number;
  totalProduction: number;
}

const BuffaloesPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [buffaloes, setBuffaloes] = useState<Buffalo[]>([]);
  const [stats, setStats] = useState<BuffaloStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buffaloData, buffaloStats] = await Promise.all([
          getBuffaloes(),
          getBuffaloStats()
        ]);
        setBuffaloes(buffaloData);
        setStats(buffaloStats);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch buffalo data",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this buffalo?")) return;
    
    try {
      await deleteBuffalo(id);
      // Refetch data to ensure consistency
      const fetchData = async () => {
        try {
          const [buffaloData, buffaloStats] = await Promise.all([
            getBuffaloes(),
            getBuffaloStats()
          ]);
          setBuffaloes(buffaloData);
          setStats(buffaloStats);
        } catch (error) {
          console.error('Failed to fetch buffalo data:', error);
        }
      };
      await fetchData();
      toast({ title: "Success", description: "Buffalo deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete buffalo" });
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green/10';
      case 'sick': return 'text-red-600 bg-red/10';
      case 'pregnant': return 'text-blue-600 bg-blue/10';
      case 'dry': return 'text-gray-600 bg-gray/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {language === 'te' ? 'ఎద్దులు' : language === 'hi' ? 'भैंसें' : 'Buffaloes'}
        </h1>
        <AddBuffaloDialog onBuffaloAdded={() => {
          const fetchData = async () => {
            try {
              const [buffaloData, buffaloStats] = await Promise.all([
                getBuffaloes(),
                getBuffaloStats()
              ]);
              setBuffaloes(buffaloData);
              setStats(buffaloStats);
            } catch (error) {
              console.error('Failed to fetch buffalo data', error);
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
              <Milk className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Production</p>
              <p className="text-xl font-bold">{stats?.totalProduction || 0}L/day</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Healthy</p>
              <p className="text-xl font-bold">{stats?.healthy || 0}/{stats?.total || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue/10 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Age</p>
              <p className="text-xl font-bold">
                {buffaloes.length > 0 
                  ? (buffaloes.reduce((sum, b) => sum + (b.age || 0), 0) / buffaloes.length).toFixed(1) 
                  : 0} years
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Need Attention</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats?.sick || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Buffaloes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buffaloes.map((buffalo) => (
          <Card key={buffalo._id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber/10 rounded-full">
                <Milk className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{buffalo.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(buffalo.healthStatus)}`}>
                    {buffalo.healthStatus}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'జాతి' : 'Breed'}: {buffalo.breed || 'Murrah'}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'వయస్సు' : 'Age'}: {buffalo.age} {language === 'te' ? 'సంవత్సరాలు' : 'years'}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'బరువు' : 'Weight'}: {buffalo.weight} kg
                  </p>
                  {buffalo.assignedTo && (
                    <p className="text-muted-foreground">
                      {language === 'te' ? 'కస్టమర్' : 'Customer'}: {buffalo.assignedTo.name}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'te' ? 'దినసరి ఉత్పత్తి' : 'Daily Production'}
                    </span>
                    <span className="font-bold text-primary">{buffalo.milkProduction}L</span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {language === 'te' ? 'సవరించు' : language === 'hi' ? 'संपादित करें' : 'Edit'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(buffalo._id)}>
                    {language === 'te' ? 'తొలగించు' : language === 'hi' ? 'हटाएं' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
=======
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Milk, Plus, Edit, Trash2, Loader2, RefreshCw, Activity,
  Calendar, MapPin
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

interface Buffalo {
  id: string;
  name: string;
  breed: string | null;
  tag_number: string | null;
  date_of_birth: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  location: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const BuffaloesPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [buffaloes, setBuffaloes] = useState<Buffalo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBuffalo, setEditingBuffalo] = useState<Buffalo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    tag_number: '',
    date_of_birth: '',
    purchase_date: '',
    purchase_price: '',
    location: '',
    status: 'active',
    notes: ''
  });

  const fetchBuffaloes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('buffaloes')
      .select('*')
      .order('name');

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setBuffaloes(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBuffaloes();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      breed: '',
      tag_number: '',
      date_of_birth: '',
      purchase_date: '',
      purchase_price: '',
      location: '',
      status: 'active',
      notes: ''
    });
    setEditingBuffalo(null);
  };

  const openEditDialog = (buffalo: Buffalo) => {
    setEditingBuffalo(buffalo);
    setFormData({
      name: buffalo.name,
      breed: buffalo.breed || '',
      tag_number: buffalo.tag_number || '',
      date_of_birth: buffalo.date_of_birth || '',
      purchase_date: buffalo.purchase_date || '',
      purchase_price: buffalo.purchase_price?.toString() || '',
      location: buffalo.location || '',
      status: buffalo.status,
      notes: buffalo.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name is required' });
      return;
    }

    setIsSaving(true);

    const buffaloData = {
      name: formData.name.trim(),
      breed: formData.breed.trim() || null,
      tag_number: formData.tag_number.trim() || null,
      date_of_birth: formData.date_of_birth || null,
      purchase_date: formData.purchase_date || null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      location: formData.location.trim() || null,
      status: formData.status,
      notes: formData.notes.trim() || null
    };

    let error;
    if (editingBuffalo) {
      ({ error } = await supabase.from('buffaloes').update(buffaloData).eq('id', editingBuffalo.id));
    } else {
      ({ error } = await supabase.from('buffaloes').insert(buffaloData));
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success!', description: editingBuffalo ? 'Buffalo updated' : 'Buffalo added' });
      setIsDialogOpen(false);
      resetForm();
      fetchBuffaloes();
    }
    setIsSaving(false);
  };

  const deleteBuffalo = async (id: string) => {
    const { error } = await supabase.from('buffaloes').delete().eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Deleted', description: 'Buffalo removed successfully' });
      fetchBuffaloes();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'dry': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'pregnant': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'sold': return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
      case 'deceased': return 'bg-red-500/10 text-red-600 border-red-500/30';
      default: return '';
    }
  };

  // Stats
  const stats = {
    total: buffaloes.length,
    active: buffaloes.filter(b => b.status === 'active').length,
    pregnant: buffaloes.filter(b => b.status === 'pregnant').length,
    dry: buffaloes.filter(b => b.status === 'dry').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Milk className="h-6 w-6 text-primary" />
            {language === 'te' ? 'బఫెలోలు' : language === 'hi' ? 'भैंसें' : 'Buffaloes'}
          </h1>
          <p className="text-muted-foreground mt-1">Manage your buffalo herd</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchBuffaloes}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="btn-golden">
                <Plus className="h-4 w-4 mr-2" />
                Add Buffalo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingBuffalo ? 'Edit Buffalo' : 'Add New Buffalo'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-2 space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Buffalo name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Breed</Label>
                  <Input
                    value={formData.breed}
                    onChange={(e) => setFormData(p => ({ ...p, breed: e.target.value }))}
                    placeholder="e.g., Murrah"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tag Number</Label>
                  <Input
                    value={formData.tag_number}
                    onChange={(e) => setFormData(p => ({ ...p, tag_number: e.target.value }))}
                    placeholder="e.g., B001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData(p => ({ ...p, date_of_birth: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Date</Label>
                  <Input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData(p => ({ ...p, purchase_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData(p => ({ ...p, purchase_price: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => setFormData(p => ({ ...p, status: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active (Milking)</SelectItem>
                      <SelectItem value="dry">Dry</SelectItem>
                      <SelectItem value="pregnant">Pregnant</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="deceased">Deceased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                    placeholder="Shed/Area"
                  />
                </div>
                <div className="col-span-2 space-y-2">
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
                  {editingBuffalo ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Herd</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Active (Milking)</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Pregnant</p>
            <p className="text-2xl font-bold text-blue-600">{stats.pregnant}</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Dry</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.dry}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{buffaloes.length} Buffaloes</CardTitle>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buffaloes.map(buffalo => (
                    <TableRow key={buffalo.id}>
                      <TableCell className="font-medium">{buffalo.name}</TableCell>
                      <TableCell>{buffalo.tag_number || '-'}</TableCell>
                      <TableCell>{buffalo.breed || '-'}</TableCell>
                      <TableCell>
                        {buffalo.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {buffalo.location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(buffalo.status)} variant="outline">
                          {buffalo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(buffalo.created_at), 'dd MMM yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(buffalo)}>
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
                                <AlertDialogTitle>Delete Buffalo?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {buffalo.name} and all records.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBuffalo(buffalo.id)} className="bg-destructive">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {buffaloes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No buffaloes found. Add your first buffalo!
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

export default BuffaloesPage;
