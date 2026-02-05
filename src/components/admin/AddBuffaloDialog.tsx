import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addBuffalo, getUsers } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddBuffaloDialogProps {
  onBuffaloAdded?: () => void;
}

export const AddBuffaloDialog: React.FC<AddBuffaloDialogProps> = ({ onBuffaloAdded }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<{_id: string; name: string; username: string}[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    tagId: '',
    breed: 'Murrah',
    age: '',
    weight: '',
    milkProduction: '',
    fatContent: '',
    healthStatus: 'healthy',
    notes: ''
  });

  const loadCustomers = async () => {
    try {
      const users = await getUsers();
      setCustomers(users);
    } catch (error) {
      console.error('Failed to load customers', error);
    }
  };

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      await loadCustomers();
    }
    setOpen(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Buffalo name is required'
      });
      return;
    }

    setIsLoading(true);

    try {
      await addBuffalo({
        name: formData.name.trim(),
        tagId: formData.tagId.trim() || undefined,
        breed: formData.breed,
        age: parseFloat(formData.age) || 0,
        weight: parseFloat(formData.weight) || 0,
        milkProduction: parseFloat(formData.milkProduction) || 0,
        fatContent: parseFloat(formData.fatContent) || undefined,
        healthStatus: formData.healthStatus,
        notes: formData.notes.trim() || undefined
      });

      toast({
        title: language === 'te' ? 'విజయం!' : language === 'hi' ? 'सफलता!' : 'Success!',
        description: language === 'te' ? 'ఎద్దు జోడించబడింది' : 
                     language === 'hi' ? 'भैंस जोड़ा गया' : 'Buffalo added successfully'
      });

      setFormData({
        name: '',
        tagId: '',
        breed: 'Murrah',
        age: '',
        weight: '',
        milkProduction: '',
        fatContent: '',
        healthStatus: 'healthy',
        notes: ''
      });
      setOpen(false);
      onBuffaloAdded?.();
    } catch (error: any) {
      console.error('Error adding buffalo:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add buffalo'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="btn-golden">
          <Plus className="h-4 w-4 mr-2" />
          {language === 'te' ? 'ఎద్దు జోడించు' : language === 'hi' ? 'भैंस जोड़ें' : 'Add Buffalo'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'te' ? 'కొత్త ఎద్దు జోడించండి' : 
             language === 'hi' ? 'नई भैंस जोड़ें' : 'Add New Buffalo'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {language === 'te' ? 'పేరు' : language === 'hi' ? 'नाम' : 'Name'} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={language === 'te' ? 'ఎద్దు పేరు' : language === 'hi' ? 'भैंस का नाम' : 'Buffalo name'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagId">
                {language === 'te' ? 'ట్యాగ్ ఐడీ' : language === 'hi' ? 'टैग आईडी' : 'Tag ID'}
              </Label>
              <Input
                id="tagId"
                value={formData.tagId}
                onChange={(e) => setFormData(prev => ({ ...prev, tagId: e.target.value }))}
                placeholder="BUF-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">
                {language === 'te' ? 'జాతి' : language === 'hi' ? 'नस्ल' : 'Breed'}
              </Label>
              <Select 
                value={formData.breed} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, breed: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Murrah">Murrah</SelectItem>
                  <SelectItem value="Jaffarabadi">Jaffarabadi</SelectItem>
                  <SelectItem value="Nili-Ravi">Nili-Ravi</SelectItem>
                  <SelectItem value="Bhadawari">Bhadawari</SelectItem>
                  <SelectItem value="Mehsana">Mehsana</SelectItem>
                  <SelectItem value="Surti">Surti</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="healthStatus">
                {language === 'te' ? 'ఆరోగ్య స్థితి' : language === 'hi' ? 'स्वास्थ्य स्थिति' : 'Health Status'}
              </Label>
              <Select 
                value={formData.healthStatus} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, healthStatus: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">
                    {language === 'te' ? 'ఆరోగ్యం' : language === 'hi' ? 'स्वस्थ' : 'Healthy'}
                  </SelectItem>
                  <SelectItem value="sick">
                    {language === 'te' ? 'అనారోగ్యం' : language === 'hi' ? 'बीमार' : 'Sick'}
                  </SelectItem>
                  <SelectItem value="pregnant">
                    {language === 'te' ? 'గర్భిణీ' : language === 'hi' ? 'गर्भवती' : 'Pregnant'}
                  </SelectItem>
                  <SelectItem value="dry">
                    {language === 'te' ? 'డ్రై' : language === 'hi' ? 'सूखा' : 'Dry'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">
                {language === 'te' ? 'వయస్సు (సంవత్సరాలు)' : language === 'hi' ? 'आयु (वर्ष)' : 'Age (years)'}
              </Label>
              <Input
                id="age"
                type="number"
                min="0"
                step="0.5"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                placeholder="4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">
                {language === 'te' ? 'బరువు (కేజీ)' : language === 'hi' ? 'वजन (किग्रा)' : 'Weight (kg)'}
              </Label>
              <Input
                id="weight"
                type="number"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="450"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="milkProduction">
                {language === 'te' ? 'పాల ఉత్పత్తి (లీ)' : language === 'hi' ? 'दूध उत्पादन (लीटर)' : 'Milk (L/day)'}
              </Label>
              <Input
                id="milkProduction"
                type="number"
                min="0"
                step="0.25"
                value={formData.milkProduction}
                onChange={(e) => setFormData(prev => ({ ...prev, milkProduction: e.target.value }))}
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatContent">
              {language === 'te' ? 'కొవ్వు శాతం' : language === 'hi' ? 'वसा प्रतिशत' : 'Fat Content (%)'}
            </Label>
            <Input
              id="fatContent"
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={formData.fatContent}
              onChange={(e) => setFormData(prev => ({ ...prev, fatContent: e.target.value }))}
              placeholder="6.5"
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
                  {language === 'te' ? 'జోడించండి' : language === 'hi' ? 'जोड़ें' : 'Add Buffalo'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
