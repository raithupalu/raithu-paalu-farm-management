import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Milk, Plus, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Customer {
  id: string;
  name: string;
  phone: string;
  default_quantity: number;
}

interface MilkEntry {
  id: string;
  entry_date: string;
  quantity_liters: number;
  total_amount: number;
  notes: string | null;
}

const QUICK_QUANTITIES = [
  { label: '½L', value: 0.5 },
  { label: '¾L', value: 0.75 },
  { label: '1L', value: 1 },
  { label: '1½L', value: 1.5 },
  { label: '2L', value: 2 },
  { label: '3L', value: 3 },
];

export const MilkEntryForm: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerLiter, setPricePerLiter] = useState<number>(80);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recentEntries, setRecentEntries] = useState<MilkEntry[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState({ quantity: 0, amount: 0, days: 0 });

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone, default_quantity')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load customers'
        });
      } else {
        setCustomers(data || []);
      }
      setIsLoading(false);
    };

    fetchCustomers();
  }, []);

  // Fetch current price
  useEffect(() => {
    const fetchPrice = async () => {
      const { data } = await supabase
        .from('milk_prices')
        .select('price_per_liter')
        .order('effective_from', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setPricePerLiter(Number(data.price_per_liter));
      }
    };

    fetchPrice();
  }, []);

  // Fetch recent entries and monthly stats when customer changes
  useEffect(() => {
    if (!selectedCustomerId) {
      setRecentEntries([]);
      setMonthlyTotal({ quantity: 0, amount: 0, days: 0 });
      return;
    }

    const fetchCustomerData = async () => {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      // Fetch recent entries
      const { data: entries } = await supabase
        .from('milk_entries')
        .select('id, entry_date, quantity_liters, total_amount, notes')
        .eq('customer_id', selectedCustomerId)
        .gte('entry_date', format(startOfMonth, 'yyyy-MM-dd'))
        .lte('entry_date', format(endOfMonth, 'yyyy-MM-dd'))
        .order('entry_date', { ascending: false });

      if (entries) {
        setRecentEntries(entries);
        const totalQty = entries.reduce((sum, e) => sum + Number(e.quantity_liters), 0);
        const totalAmt = entries.reduce((sum, e) => sum + Number(e.total_amount), 0);
        setMonthlyTotal({
          quantity: totalQty,
          amount: totalAmt,
          days: entries.length
        });
      }

      // Set default quantity for selected customer
      const customer = customers.find(c => c.id === selectedCustomerId);
      if (customer) {
        setQuantity(Number(customer.default_quantity) || 1);
      }
    };

    fetchCustomerData();
  }, [selectedCustomerId, date, customers]);

  const totalAmount = quantity * pricePerLiter;

  const handleSave = async () => {
    if (!selectedCustomerId) {
      toast({
        variant: 'destructive',
        title: language === 'te' ? 'లోపం' : language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'te' ? 'దయచేసి కస్టమర్‌ని ఎంచుకోండి' : 
                     language === 'hi' ? 'कृपया ग्राहक चुनें' : 'Please select a customer'
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Quantity must be greater than 0'
      });
      return;
    }

    setIsSaving(true);

    const { error } = await supabase
      .from('milk_entries')
      .upsert({
        customer_id: selectedCustomerId,
        entry_date: format(date, 'yyyy-MM-dd'),
        quantity_liters: quantity,
        price_per_liter: pricePerLiter,
        total_amount: totalAmount,
        notes: notes || null
      }, {
        onConflict: 'customer_id,entry_date'
      });

    if (error) {
      console.error('Error saving entry:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    } else {
      toast({
        title: language === 'te' ? 'విజయం!' : language === 'hi' ? 'सफलता!' : 'Success!',
        description: language === 'te' ? 'పాల ఎంట్రీ సేవ్ చేయబడింది' : 
                     language === 'hi' ? 'दूध प्रविष्टि सहेजी गई' : 'Milk entry saved successfully'
      });
      
      // Refresh entries
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const { data: entries } = await supabase
        .from('milk_entries')
        .select('id, entry_date, quantity_liters, total_amount, notes')
        .eq('customer_id', selectedCustomerId)
        .gte('entry_date', format(startOfMonth, 'yyyy-MM-dd'))
        .lte('entry_date', format(endOfMonth, 'yyyy-MM-dd'))
        .order('entry_date', { ascending: false });

      if (entries) {
        setRecentEntries(entries);
        const totalQty = entries.reduce((sum, e) => sum + Number(e.quantity_liters), 0);
        const totalAmt = entries.reduce((sum, e) => sum + Number(e.total_amount), 0);
        setMonthlyTotal({
          quantity: totalQty,
          amount: totalAmt,
          days: entries.length
        });
      }

      setNotes('');
    }

    setIsSaving(false);
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Entry Form */}
      <Card className="lg:col-span-2 border-border/50 shadow-elegant">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Milk className="h-5 w-5 text-primary" />
            {language === 'te' ? 'పాల ఎంట్రీ' : language === 'hi' ? 'दूध प्रविष्टि' : 'Milk Entry'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Customer Selector */}
          <div className="space-y-2">
            <Label>{language === 'te' ? 'కస్టమర్' : language === 'hi' ? 'ग्राहक' : 'Customer'}</Label>
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={
                  language === 'te' ? 'కస్టమర్‌ని ఎంచుకోండి...' : 
                  language === 'hi' ? 'ग्राहक चुनें...' : 'Select customer...'
                } />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-muted-foreground ml-2">({customer.phone})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>{language === 'te' ? 'తేదీ' : language === 'hi' ? 'तारीख' : 'Date'}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Quick Quantity Buttons */}
          <div className="space-y-2">
            <Label>{language === 'te' ? 'పరిమాణం (లీటర్లు)' : language === 'hi' ? 'मात्रा (लीटर)' : 'Quantity (Liters)'}</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_QUANTITIES.map(q => (
                <Button
                  key={q.value}
                  type="button"
                  variant={quantity === q.value ? "default" : "outline"}
                  className={cn(
                    "h-10 px-4",
                    quantity === q.value && "btn-golden"
                  )}
                  onClick={() => setQuantity(q.value)}
                >
                  {q.label}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              step="0.25"
              min="0.25"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-12"
            />
          </div>

          {/* Price Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'te' ? 'ధర/లీటర్' : language === 'hi' ? 'कीमत/लीटर' : 'Price/Liter'}</Label>
              <div className="h-12 px-4 flex items-center bg-muted rounded-lg text-foreground font-semibold">
                ₹{pricePerLiter.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === 'te' ? 'మొత్తం' : language === 'hi' ? 'कुल' : 'Total'}</Label>
              <div className="h-12 px-4 flex items-center bg-primary/10 rounded-lg text-primary font-bold text-lg">
                ₹{totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>{language === 'te' ? 'గమనికలు' : language === 'hi' ? 'नोट्स' : 'Notes'}</Label>
            <Textarea
              placeholder={
                language === 'te' ? 'ఐచ్ఛిక గమనికలు...' : 
                language === 'hi' ? 'वैकल्पिक नोट्स...' : 'Optional notes...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !selectedCustomerId}
            className="w-full h-12 btn-golden font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {language === 'te' ? 'సేవ్ చేస్తోంది...' : language === 'hi' ? 'सहेज रहा है...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                {language === 'te' ? 'ఎంట్రీ సేవ్ చేయండి' : language === 'hi' ? 'प्रविष्टि सहेजें' : 'Save Entry'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Right Panel - Monthly Summary & Recent Entries */}
      <div className="space-y-6">
        {/* Monthly Summary */}
        <Card className="border-border/50 shadow-elegant">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'te' ? 'నెలవారీ సారాంశం' : language === 'hi' ? 'मासिक सारांश' : 'Monthly Summary'}
              {selectedCustomer && (
                <span className="block text-foreground mt-1">{selectedCustomer.name}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {selectedCustomerId ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {language === 'te' ? 'మొత్తం పరిమాణం' : language === 'hi' ? 'कुल मात्रा' : 'Total Quantity'}
                  </span>
                  <span className="font-semibold text-foreground">{monthlyTotal.quantity.toFixed(2)}L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {language === 'te' ? 'మొత్తం మొత్తం' : language === 'hi' ? 'कुल राशि' : 'Total Amount'}
                  </span>
                  <span className="font-bold text-primary">₹{monthlyTotal.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {language === 'te' ? 'రోజులు' : language === 'hi' ? 'दिन' : 'Days'}
                  </span>
                  <span className="font-semibold text-foreground">{monthlyTotal.days}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                {language === 'te' ? 'సారాంశం చూడటానికి కస్టమర్‌ని ఎంచుకోండి' : 
                 language === 'hi' ? 'सारांश देखने के लिए ग्राहक चुनें' : 'Select a customer to view summary'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="border-border/50 shadow-elegant">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'te' ? 'ఇటీవలి ఎంట్రీలు' : language === 'hi' ? 'हाल की प्रविष्टियां' : 'Recent Entries'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentEntries.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentEntries.slice(0, 10).map(entry => (
                  <div 
                    key={entry.id} 
                    className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {format(new Date(entry.entry_date), 'dd MMM')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Number(entry.quantity_liters).toFixed(2)}L
                      </p>
                    </div>
                    <span className="font-semibold text-primary">
                      ₹{Number(entry.total_amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                {selectedCustomerId 
                  ? (language === 'te' ? 'ఈ నెలలో ఎంట్రీలు లేవు' : language === 'hi' ? 'इस महीने कोई प्रविष्टियां नहीं' : 'No entries this month')
                  : (language === 'te' ? 'కస్టమర్‌ని ఎంచుకోండి' : language === 'hi' ? 'ग्राहक चुनें' : 'Select a customer')
                }
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
