import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MilkEntryForm } from '@/components/admin/MilkEntryForm';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MilkEntryPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle successful milk entry submission
  const handleMilkSubmit = () => {
    console.log('Milk entry saved');
  };

  // Handle customer added - refresh the form to show new customer
  const handleCustomerAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'te' ? 'పాల ఎంట్రీ' : language === 'hi' ? 'दूध प्रविष्टि' : 'Milk Entry'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'te'
              ? 'కస్టమర్ల కోసం రోజువారీ పాల డెలివరీలను రికార్డ్ చేయండి'
              : language === 'hi'
              ? 'ग्राहकों के लिए दैनिक दूध वितरण रिकॉर्ड करें'
              : 'Record daily milk deliveries for customers'}
          </p>
        </div>
        <Button onClick={() => navigate('/admin/customers')}>
          <UserPlus className="h-4 w-4 mr-2" />
          {language === 'te' ? 'కస్టమర్ జోడించు' : language === 'hi' ? 'ग्राहक जोड़ें' : 'Add Customer'}
        </Button>
      </div>

      {/* Milk Entry Form with refresh key to reload customers */}
      <MilkEntryForm 
        key={refreshKey}
        onSubmit={handleMilkSubmit} 
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
};

export default MilkEntryPage;
