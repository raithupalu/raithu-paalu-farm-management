import React from 'react';
import { MilkEntryForm } from '@/components/admin/MilkEntryForm';
import { AddCustomerDialog } from '@/components/admin/AddCustomerDialog';
import { useLanguage } from '@/contexts/LanguageContext';

const MilkEntryPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'te' ? 'పాల ఎంట్రీ' : language === 'hi' ? 'दूध प्रविष्टि' : 'Milk Entry'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'te' ? 'కస్టమర్ల కోసం రోజువారీ పాల డెలివరీలను రికార్డ్ చేయండి' : 
             language === 'hi' ? 'ग्राहकों के लिए दैनिक दूध वितरण रिकॉर्ड करें' : 
             'Record daily milk deliveries for customers'}
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      {/* Milk Entry Form */}
      <MilkEntryForm />
    </div>
  );
};

export default MilkEntryPage;
