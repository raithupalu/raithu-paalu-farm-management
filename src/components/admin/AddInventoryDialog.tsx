import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addInventoryItem } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';

const categories = ['Feed', 'Medicine', 'Equipment', 'Supplies', 'Tools', 'Other'];
const statuses = ['in-stock', 'low-stock', 'out-of-stock'];

interface AddInventoryDialogProps {
  onInventoryAdded?: () => void;
}

export const AddInventoryDialog: React.FC<AddInventoryDialogProps> = ({ onInventoryAdded }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Feed',
    description: '',
    quantity: '',
    unit: 'pieces',
    minQuantity: '',
    price: '',
    supplier: '',
    status: 'in-stock',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Item name is required'
      });
      return;
    }

    setIsLoading(true);

    try {
      await addInventoryItem({
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || undefined,
        quantity: parseFloat(formData.quantity) || 0,
        unit: formData.unit,
        minQuantity: formData.minQuantity ? parseFloat(formData.minQuantity) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        supplier: formData.supplier.trim() || undefined,
        status: formData.status,
        location: formData.location.trim() || undefined,
        notes: formData.notes.trim() || undefined
      });

      toast({
        title: language === 'te' ? 'విజయం!' : language === 'hi' ? 'सफलता!' : 'Success!',
        description: language === 'te' ? 'ఇన్వెంటరీ జోడించబడింది' : 
                   language === 'hi' ? 'इन्वेंटरी जोड़ी गई' : 'Inventory item added successfully'
      });

      setFormData({
        name: '',
        category: 'Feed',
        description: '',
        quantity: '',
        unit: 'pieces',
        minQuantity: '',
        price: '',
        supplier: '',
        status: 'in-stock',
        location: '',
        notes: ''
      });
      setOpen(false);
      onInventoryAdded?.();
    } catch (error: any) {
      console.error('Error adding inventory:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add inventory item'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-golden">
          <Plus className="h-4 w-4 mr-2" />
          {language === 'te' ? 'ఇన్వెంటరీ జోడించు' : language === 'hi' ? 'इन्वेंटरी जोड़ें' : 'Add Inventory'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'te' ? 'కొత్త ఇన్వెంటరీ జోడించండి' : 
             language === 'hi' ? 'नई इन्वेंटरी जोड़ें' : 'Add New Inventory Item'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === 'te' ? 'పేరు' : language === 'hi' ? 'नाम' : 'Item Name'} *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={language === 'te' ? 'ఇన్వెంటరీ పేరు' : language === 'hi' ? 'इन्वेंटरी का नाम' : 'Item name'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                {language === 'te' ? 'వర్గం' : language === 'hi' ? 'श्रेणी' : 'Category'}
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">
                {language === 'te' ? 'స్థితి' : language === 'hi' ? 'स्थिति' : 'Status'}
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">
                    {language === 'te' ? 'ఉంది' : language === 'hi' ? 'उपलब्ध' : 'In Stock'}
                  </SelectItem>
                  <SelectItem value="low-stock">
                    {language === 'te' ? 'తక్కువ' : language === 'hi' ? 'कम' : 'Low Stock'}
                  </SelectItem>
                  <SelectItem value="out-of-stock">
                    {language === 'te' ? 'లేదు' : language === 'hi' ? 'उपलब्ध नहीं' : 'Out of Stock'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {language === 'te' ? 'వివరణ' : language === 'hi' ? 'विवरण' : 'Description'}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={language === 'te' ? 'ఇన్వెంటరీ వివరాలు' : language === 'hi' ? 'इन्वेंटरी विवरण' : 'Item description'}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                {language === 'te' ? 'పరిమాణం' : language === 'hi' ? 'मात्रा' : 'Quantity'} *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">
                {language === 'te' ? 'యూనిట్' : language === 'hi' ? 'इकाई' : 'Unit'}
              </Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="pieces, kg, L"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">
                {language === 'te' ? 'కనిష్ట పరిమాణం' : language === 'hi' ? 'न्यूनतम मात्रा' : 'Min Qty'}
              </Label>
              <Input
                id="minQuantity"
                type="number"
                min="0"
                step="0.01"
                value={formData.minQuantity}
                onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: e.target.value }))}
                placeholder="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                {language === 'te' ? 'ధర (₹)' : language === 'hi' ? 'मूल्य (₹)' : 'Price (₹)'}
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">
                {language === 'te' ? 'సరఫరాదారు' : language === 'hi' ? 'आपूर्तिकर्ता' : 'Supplier'}
              </Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                placeholder={language === 'te' ? 'సరఫరాదారు పేరు' : language === 'hi' ? 'आपूर्तिकर्ता का नाम' : 'Supplier name'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              {language === 'te' ? 'స్థానం' : language === 'hi' ? 'स्थान' : 'Location'}
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder={language === 'te' ? 'ఎక్కడ ఉంది' : language === 'hi' ? 'कहाँ है' : 'Storage location'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              {language === 'te' ? 'గమనికలు' : language === 'hi' ? 'नोट्स' : 'Notes'}
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder={language === 'te' ? 'అదనపు వివరాలు' : language === 'hi' ? 'अतिरिक्त विवरण' : 'Additional details'}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'te' ? 'రద్దు' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isLoading} className="btn-golden">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'te' ? 'జోడిస్తోంది...' : language === 'hi' ? 'जोड़ रहा है...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'జోడించండి' : language === 'hi' ? 'जोड़ें' : 'Add Item'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
