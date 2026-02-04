import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Save,
  Milk,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  subscription_type: string;
  default_quantity: number;
  is_active: boolean;
}

const UserProfile: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    setIsLoading(true);
    
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setFormData({
          name: data.name,
          phone: data.phone,
          address: data.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);

    const { error } = await supabase
      .from('customers')
      .update({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || null
      })
      .eq('id', profile.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success!', description: 'Profile updated' });
      fetchProfile();
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          {language === 'te' ? 'నా ప్రొఫైల్' : language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'te' ? 'ప్రొఫైల్ సమాచారం' : language === 'hi' ? 'प्रोफ़ाइल जानकारी' : 'Profile Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {language === 'te' ? 'పేరు' : language === 'hi' ? 'नाम' : 'Name'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === 'te' ? 'ఫోన్' : language === 'hi' ? 'फ़ोन' : 'Phone'}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'te' ? 'ఇమెయిల్' : language === 'hi' ? 'ईमेल' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                {language === 'te' ? 'చిరునామా' : language === 'hi' ? 'पता' : 'Address'}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                  className="pl-10"
                  rows={3}
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="btn-golden">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {language === 'te' ? 'సేవ్ చేయండి' : language === 'hi' ? 'सहेजें' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'te' ? 'సబ్‌స్క్రిప్షన్' : language === 'hi' ? 'सब्सक्रिप्शन' : 'Subscription'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="outline" className="capitalize">{profile.subscription_type}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Default Qty</span>
              <span className="font-semibold flex items-center gap-1">
                <Milk className="h-4 w-4 text-primary" />
                {profile.default_quantity}L
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
