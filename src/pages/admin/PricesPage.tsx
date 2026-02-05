import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { getPrices, addPrice, updatePrice, deletePrice } from '@/services/api';

interface Price {
  _id: string;
  name: string;
  pricePerLiter: number;
  unit: string;
}

const PricesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [formData, setFormData] = useState({ name: '', pricePerLiter: '', unit: 'L' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch prices from backend - single source of truth
  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPrices();
      setPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
      // Don't use fallback data - let user know there's an error
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch prices from server'
      });
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingPrice) {
        // Update existing price
        const updated = await updatePrice(editingPrice._id, {
          name: formData.name,
          pricePerLiter: parseFloat(formData.pricePerLiter),
          unit: formData.unit
        });
        
        toast({
          title: language === 'te' ? 'ధర నవీకరించబడింది' : 
                 language === 'hi' ? 'कीमत अपडेट हो गई' : 'Price Updated',
        });
      } else {
        // Add new price
        await addPrice({
          name: formData.name,
          pricePerLiter: parseFloat(formData.pricePerLiter),
          unit: formData.unit
        });
        
        toast({
          title: language === 'te' ? 'ధర జోడించబడింది' : 
                 language === 'hi' ? 'कीमत जोड़ दी गई' : 'Price Added',
        });
      }
      
      // Always refetch from backend after CRUD to ensure consistency
      await fetchPrices();
      setFormData({ name: '', pricePerLiter: '', unit: 'L' });
      setEditingPrice(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error',
        description: String(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (price: Price) => {
    setEditingPrice(price);
    setFormData({ name: price.name, pricePerLiter: price.pricePerLiter.toString(), unit: price.unit });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price?')) return;
    
    try {
      await deletePrice(id);
      // Refetch from backend after delete
      await fetchPrices();
      toast({
        title: language === 'te' ? 'ధర తీసివేయబడింది' : 
               language === 'hi' ? 'कीमत हटा दी गई' : 'Price Deleted',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error',
        description: 'Failed to delete price'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {language === 'te' ? 'ధరలు' : language === 'hi' ? 'कीमतें' : 'Prices'}
        </h1>
        <Button variant="outline" onClick={fetchPrices} disabled={loading}>
          <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingPrice 
              ? (language === 'te' ? 'ధర సవరించు' : language === 'hi' ? 'कीमत संपादित करें' : 'Edit Price')
              : (language === 'te' ? 'కొత్త ధర జోడించండి' : language === 'hi' ? 'नई कीमत जोड़ें' : 'Add New Price')
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">
                  {language === 'te' ? 'పేరు' : language === 'hi' ? 'नाम' : 'Name'}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'te' ? 'పాల రకం' : language === 'hi' ? 'दूध का प्रकार' : 'Milk Type'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pricePerLiter">
                  {language === 'te' ? 'లీటర్‌కు ధర' : language === 'hi' ? 'प्रति लीटर कीमत' : 'Price per Liter'}
                </Label>
                <Input
                  id="pricePerLiter"
                  type="number"
                  value={formData.pricePerLiter}
                  onChange={(e) => setFormData({ ...formData, pricePerLiter: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">
                  {language === 'te' ? 'యూనిట్' : language === 'hi' ? 'इकाई' : 'Unit'}
                </Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="L"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{language === 'te' ? 'లోడింగ్...' : language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" />{editingPrice 
                    ? (language === 'te' ? 'నవీకరించు' : language === 'hi' ? 'अपडेट करें' : 'Update')
                    : (language === 'te' ? 'జోడించు' : language === 'hi' ? 'जोड़ें' : 'Add')}</>
                )}
              </Button>
              {editingPrice && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingPrice(null);
                  setFormData({ name: '', pricePerLiter: '', unit: 'L' });
                }}>
                  {language === 'te' ? 'రద్దు' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Prices List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'te' ? 'ధరల జాబిల్లి' : language === 'hi' ? 'कीमत सूची' : 'Price List'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prices.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {language === 'te' ? 'ఎలాంటి ధరలు లేవు' : language === 'hi' ? 'कोई कीमतें नहीं' : 'No prices found'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prices.map((price) => (
                  <div key={price._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{price.name}</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{price.pricePerLiter}/{price.unit}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(price)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(price._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricesPage;
