import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createUser, getUsers } from '@/services/api';
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
    village: '',
    taluka: '',
    district: '',
    username: '',
    password: '',
    subscription_type: 'daily',
    default_quantity: '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.username.trim() || !formData.password.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Name, phone, username and password are required'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      const userResponse = await createUser({
        username: formData.username.trim(),
        name: formData.name.trim(),
        email: `${formData.username.trim()}@example.com`,
        phone: formData.phone.trim(),
        password: formData.password,
        address: formData.address.trim() || undefined,
        village: formData.village.trim() || undefined,
        taluka: formData.taluka.trim() || undefined,
        district: formData.district.trim() || undefined,
        role: 'user',
        status: 'active'
      });

      toast({
        title: language === 'te' ? 'విజయం!' : language === 'hi' ? 'सफलता!' : 'Success!',
        description: language === 'te' ? 'కస్టమర్ జోడించబడింది' : 
                     language === 'hi' ? 'ग्राहक जोड़ा गया' : 'Customer added successfully'
      });

      setFormData({
        name: '',
        phone: '',
        address: '',
        village: '',
        taluka: '',
        district: '',
        username: '',
        password: '',
        subscription_type: 'daily',
        default_quantity: '1'
      });
      setOpen(false);
      onCustomerAdded?.();
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add customer'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-golden">
          <UserPlus className="h-4 w-4 mr-2" />
          {language === 'te' ? 'కస్టమర్ జోడించండి' : language === 'hi' ? 'ग्राहक जोड़ें' : 'Add Customer'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                {language === 'te' ? 'యూజర్‌నేమ్' : language === 'hi' ? 'यूज़रनेम' : 'Username'} *
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {language === 'te' ? 'పాస్‌వర్డ్' : language === 'hi' ? 'पासवर्ड' : 'Password'} *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="******"
                required
              />
            </div>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="village">
                {language === 'te' ? 'గ్రామం' : language === 'hi' ? 'गाँव' : 'Village'}
              </Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                placeholder="Village"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taluka">
                {language === 'te' ? 'తాలూకా' : language === 'hi' ? 'तालुका' : 'Taluka'}
              </Label>
              <Input
                id="taluka"
                value={formData.taluka}
                onChange={(e) => setFormData(prev => ({ ...prev, taluka: e.target.value }))}
                placeholder="Taluka"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">
                {language === 'te' ? 'జిల్లా' : language === 'hi' ? 'जिला' : 'District'}
              </Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                placeholder="District"
              />
            </div>
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
