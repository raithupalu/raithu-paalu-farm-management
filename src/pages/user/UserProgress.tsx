import React from 'react';
import {
  Milk,
  IndianRupee,
  Calendar,
  TrendingUp,
  Download,
  QrCode,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

const weekData = [
  { day: 'Mon', delivered: true, quantity: '1L' },
  { day: 'Tue', delivered: true, quantity: '1L' },
  { day: 'Wed', delivered: true, quantity: '1.5L' },
  { day: 'Thu', delivered: true, quantity: '1L' },
  { day: 'Fri', delivered: true, quantity: '1L' },
  { day: 'Sat', delivered: false, quantity: '-' },
  { day: 'Sun', delivered: false, quantity: '-' },
];

const UserProgress: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const monthlyTotal = 28.5;
  const monthlyTarget = 30;
  const pendingAmount = 850;
  const daysDelivered = 22;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('monthlyMilk')}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {monthlyTotal} L
                </p>
                <Progress value={(monthlyTotal / monthlyTarget) * 100} className="mt-2 h-2" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Milk className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'te' ? 'డెలివరీ రోజులు' : 
                   language === 'hi' ? 'डिलीवरी दिन' : 'Delivery Days'}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {daysDelivered}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'te' ? 'ఈ నెల' : 
                   language === 'hi' ? 'इस महीने' : 'this month'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card border-warning/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('pendingPayments')}
                </p>
                <p className="text-2xl font-bold text-warning mt-1">
                  ₹{pendingAmount}
                </p>
                <Button size="sm" variant="link" className="p-0 h-auto text-warning">
                  {language === 'te' ? 'ఇప్పుడే చెల్లించండి' : 
                   language === 'hi' ? 'अभी भुगतान करें' : 'Pay Now'}
                </Button>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'te' ? 'తదుపరి డెలివరీ' : 
                   language === 'hi' ? 'अगली डिलीवरी' : 'Next Delivery'}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  Tomorrow
                </p>
                <p className="text-sm text-success mt-1">6:00 - 7:00 AM</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* This Week & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* This Week's Deliveries */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {language === 'te' ? 'ఈ వారం' : 
               language === 'hi' ? 'इस सप्ताह' : 'This Week'}
            </CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'te' ? 'నెల చూడండి' : 
               language === 'hi' ? 'महीना देखें' : 'View Month'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekData.map((day, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    day.delivered 
                      ? 'bg-success/10 border border-success/30' 
                      : 'bg-muted/50 border border-border'
                  }`}
                >
                  <p className="text-xs font-medium text-muted-foreground">{day.day}</p>
                  <div className={`w-8 h-8 rounded-full mx-auto my-2 flex items-center justify-center ${
                    day.delivered ? 'bg-success' : 'bg-muted'
                  }`}>
                    <Milk className={`h-4 w-4 ${day.delivered ? 'text-success-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <p className={`text-sm font-semibold ${day.delivered ? 'text-success' : 'text-muted-foreground'}`}>
                    {day.quantity}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'te' ? 'త్వరిత చర్యలు' : 
               language === 'hi' ? 'त्वरित कार्रवाई' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start btn-golden">
              <IndianRupee className="mr-2 h-4 w-4" />
              {language === 'te' ? 'చెల్లింపు చేయండి' : 
               language === 'hi' ? 'भुगतान करें' : 'Make Payment'}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              {language === 'te' ? 'PDF డౌన్‌లోడ్' : 
               language === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <QrCode className="mr-2 h-4 w-4" />
              {language === 'te' ? 'QR కోడ్' : 
               language === 'hi' ? 'QR कोड' : 'QR Code'}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" />
              {language === 'te' ? 'రిమైండర్ సెట్ చేయండి' : 
               language === 'hi' ? 'रिमाइंडर सेट करें' : 'Set Reminder'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Calendar Placeholder */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {language === 'te' ? 'జనవరి 2025 - వినియోగ క్యాలెండర్' : 
             language === 'hi' ? 'जनवरी 2025 - उपभोग कैलेंडर' : 'January 2025 - Consumption Calendar'}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-muted-foreground">
                {language === 'te' ? 'డెలివరీ అయింది' : 
                 language === 'hi' ? 'डिलीवर किया गया' : 'Delivered'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span className="text-muted-foreground">
                {language === 'te' ? 'డెలివరీ లేదు' : 
                 language === 'hi' ? 'कोई डिलीवरी नहीं' : 'No Delivery'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{language === 'te' ? 'క్యాలెండర్ వ్యూ త్వరలో వస్తుంది' : 
                  language === 'hi' ? 'कैलेंडर व्यू जल्द आ रहा है' : 'Calendar view coming soon'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProgress;
