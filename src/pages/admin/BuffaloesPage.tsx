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
    </div>
  );
};

export default BuffaloesPage;
