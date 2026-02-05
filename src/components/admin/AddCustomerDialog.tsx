import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddCustomerDialogProps {
  onCustomerAdded?: () => void;
}

export const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({ onCustomerAdded }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    subscription_type: 'daily',
    default_quantity: '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Name and phone are required'
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('customers')
      .insert({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || null,
        subscription_type: formData.subscription_type,
        default_quantity: parseFloat(formData.default_quantity)
      });

    if (error) {
      console.error('Error adding customer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    } else {
      toast({
        title: language === 'te' ? 'విజయం!' : language === 'hi' ? 'सफलता!' : 'Success!',
        description: language === 'te' ? 'కస్టమర్ జోడించబడింది' : 
                     language === 'hi' ? 'ग्राहक जोड़ा गया' : 'Customer added successfully'
      });
      setFormData({
        name: '',
        phone: '',
        address: '',
        subscription_type: 'daily',
        default_quantity: '1'
      });
      setOpen(false);
      onCustomerAdded?.();
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-golden">
          <UserPlus className="h-4 w-4 mr-2" />
          {language === 'te' ? 'కస్టమర్ జోడించండి' : language === 'hi' ? 'ग्राहक जोड़ें' : 'Add Customer'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'te' ? 'కొత్త కస్టమర్ జోడించండి' : 
             language === 'hi' ? 'नया ग्राहक जोड़ें' : 'Add New Customer'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === 'te' ? 'పేరు' : language === 'hi' ? 'नाम' : 'Name'} *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={language === 'te' ? 'కస్టమర్ పేరు' : language === 'hi' ? 'ग्राहक का नाम' : 'Customer name'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              {language === 'te' ? 'ఫోన్' : language === 'hi' ? 'फ़ोन' : 'Phone'} *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              {language === 'te' ? 'చిరునామా' : language === 'hi' ? 'पता' : 'Address'}
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder={language === 'te' ? 'చిరునామా (ఐచ్ఛికం)' : 
                           language === 'hi' ? 'पता (वैकल्पिक)' : 'Address (optional)'}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                {language === 'te' ? 'సబ్‌స్క్రిప్షన్' : language === 'hi' ? 'सब्सक्रिप्शन' : 'Subscription'}
              </Label>
              <Select 
                value={formData.subscription_type} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, subscription_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">
                    {language === 'te' ? 'రోజువారీ' : language === 'hi' ? 'दैनिक' : 'Daily'}
                  </SelectItem>
                  <SelectItem value="alternate">
                    {language === 'te' ? 'ప్రత్యామ్నాయ' : language === 'hi' ? 'वैकल्पिक' : 'Alternate'}
                  </SelectItem>
                  <SelectItem value="custom">
                    {language === 'te' ? 'అనుకూల' : language === 'hi' ? 'कस्टम' : 'Custom'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_quantity">
                {language === 'te' ? 'డిఫాల్ట్ పరిమాణం (L)' : 
                 language === 'hi' ? 'डिफ़ॉल्ट मात्रा (L)' : 'Default Qty (L)'}
              </Label>
              <Input
                id="default_quantity"
                type="number"
                step="0.25"
                min="0.25"
                value={formData.default_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, default_quantity: e.target.value }))}
              />
            </div>
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
                  <UserPlus className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'జోడించండి' : language === 'hi' ? 'जोड़ें' : 'Add Customer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
