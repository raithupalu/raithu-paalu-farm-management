import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addExpense } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';

const categories = ['Feed', 'Medicine', 'Labor', 'Equipment', 'Utilities', 'Maintenance', 'Transportation', 'Other'];

const subCategories: Record<string, string[]> = {
  Feed: ['Concentrate', 'Green Fodder', 'Dry Fodder', 'Mineral Mix', 'Salt', 'Other'],
  Medicine: ['Vaccine', 'Deworming', 'Antibiotics', 'Vitamins', 'Hoof Care', 'Other'],
  Labor: ['Permanent Worker', 'Temporary Worker', 'Herdsman', 'Other'],
  Equipment: ['Milking Machine', 'Feed Mixer', 'Water Pump', 'Other'],
  Maintenance: ['Barn Repair', 'Equipment Repair', 'Fence Repair', 'Other'],
  Utilities: ['Electricity', 'Water', 'Gas', 'Internet', 'Other'],
  Transportation: ['Fuel', 'Vehicle Repair', 'Driver Salary', 'Other'],
  Other: []
};

interface AddExpenseDialogProps {
  onExpenseAdded?: () => void;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({ onExpenseAdded }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Feed',
    subCategory: '',
    description: '',
    amount: '',
    quantity: '',
    unit: '',
    vendor: '',
    paymentMode: 'cash',
    notes: ''
  });

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category,
      subCategory: subCategories[category]?.length > 0 ? '' : prev.subCategory
    }));
  };

  const getDynamicLabel = () => {
    switch (formData.category) {
      case 'Feed': return language === 'te' ? 'ఫీడ్ రకం' : language === 'hi' ? 'फीड का प्रकार' : 'Feed Type';
      case 'Medicine': return language === 'te' ? 'మందు రకం' : language === 'hi' ? 'दवा का प्रकार' : 'Medicine Type';
      case 'Labor': return language === 'te' ? 'పని రకం' : language === 'hi' ? 'काम का प्रकार' : 'Work Type';
      case 'Equipment': return language === 'te' ? 'పరికరం రకం' : language === 'hi' ? 'उपकरण का प्रकार' : 'Equipment Type';
      case 'Maintenance': return language === 'te' ? 'మరమ్మతు రకం' : language === 'hi' ? 'रखरखाव का प्रकार' : 'Maintenance Type';
      default: return language === 'te' ? 'ఉప వర్గం' : language === 'hi' ? 'उप श्रेणी' : 'Sub Category';
    }
  };

  const getDynamicPlaceholder = () => {
    switch (formData.category) {
      case 'Feed': return language === 'te' ? 'ఫీడ్ రకం ఎంచుకోండి' : language === 'hi' ? 'फीड का प्रकार चुनें' : 'Select feed type';
      case 'Medicine': return language === 'te' ? 'మందు రకం ఎంచుకోండి' : language === 'hi' ? 'दवा का प्रकार चुनें' : 'Select medicine type';
      case 'Labor': return language === 'te' ? 'పని రకం ఎంచుకోండి' : language === 'hi' ? 'काम का प्रकार चुनें' : 'Select work type';
      case 'Equipment': return language === 'te' ? 'పరికరం రకం ఎంచుకోండి' : language === 'hi' ? 'उपकरण का प्रकार चुनें' : 'Select equipment type';
      case 'Maintenance': return language === 'te' ? 'మరమ్మతు రకం ఎంచుకోండి' : language === 'hi' ? 'रखरखाव का प्रकार चुनें' : 'Select maintenance type';
      default: return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Description and amount are required'
      });
      return;
    }

    setIsLoading(true);

    try {
      await addExpense({
        category: formData.category,
        subCategory: formData.subCategory.trim() || undefined,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        unit: formData.unit.trim() || undefined,
        vendor: formData.vendor.trim() || undefined,
        paymentMode: formData.paymentMode,
        notes: formData.notes.trim() || undefined,
        date: new Date().toISOString(),
        status: 'pending'
      });

      toast({
        title: language === 'te' ? 'విజయం!' : language === 'hi' ? 'सफलता!' : 'Success!',
        description: language === 'te' ? 'ఖర్చు జోడించబడింది' : 
                   language === 'hi' ? 'खर्च जोड़ा गया' : 'Expense added successfully'
      });

      setFormData({
        category: 'Feed',
        subCategory: '',
        description: '',
        amount: '',
        quantity: '',
        unit: '',
        vendor: '',
        paymentMode: 'cash',
        notes: ''
      });
      setOpen(false);
      onExpenseAdded?.();
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add expense'
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
          {language === 'te' ? 'ఖర్చు జోడించు' : language === 'hi' ? 'खर्च जोड़ें' : 'Add Expense'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'te' ? 'కొత్త ఖర్చు జోడించండి' : 
             language === 'hi' ? 'नया खर्च जोड़ें' : 'Add New Expense'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                {language === 'te' ? 'వర్గం' : language === 'hi' ? 'श्रेणी' : 'Category'} *
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
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
              <Label htmlFor="amount">
                {language === 'te' ? 'మొత్తం (₹)' : language === 'hi' ? 'राशि (₹)' : 'Amount (₹)'} *
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Dynamic Sub Category Field - shown only for categories with subCategories */}
          {subCategories[formData.category]?.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subCategory">
                {getDynamicLabel()}
              </Label>
              <Select 
                value={formData.subCategory} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, subCategory: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getDynamicPlaceholder()} />
                </SelectTrigger>
                <SelectContent>
                  {subCategories[formData.category].map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">
              {language === 'te' ? 'వివరణ' : language === 'hi' ? 'विवरण' : 'Description'} *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={language === 'te' ? 'ఖర్చు వివరాలు' : language === 'hi' ? 'खर्च का विवरण' : 'Expense details'}
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                {language === 'te' ? 'పరిమాణం' : language === 'hi' ? 'मात्रा' : 'Quantity'}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="1"
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
                placeholder="kg, L, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMode">
                {language === 'te' ? 'చెల్లింపు' : language === 'hi' ? 'भुगतान' : 'Payment'}
              </Label>
              <Select 
                value={formData.paymentMode} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, paymentMode: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">
              {language === 'te' ? 'విక్రేత/దుకాణం' : language === 'hi' ? 'विक्रेता/दुकान' : 'Vendor/Shop'}
            </Label>
            <Input
              id="vendor"
              value={formData.vendor}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
              placeholder={language === 'te' ? 'విక్రేత పేరు' : language === 'hi' ? 'विक्रेता का नाम' : 'Vendor name'}
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
                  {language === 'te' ? 'జోడించండి' : language === 'hi' ? 'जोड़ें' : 'Add Expense'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
