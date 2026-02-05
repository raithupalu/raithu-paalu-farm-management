import React from 'react';
import {
  Milk,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const stats = [
  {
    titleKey: 'todaysMilk' as const,
    value: '245 L',
    change: '+12%',
    trend: 'up',
    icon: Milk,
    color: 'primary',
  },
  {
    titleKey: 'monthlyMilk' as const,
    value: '5,840 L',
    change: '+8%',
    trend: 'up',
    icon: Calendar,
    color: 'success',
  },
  {
    titleKey: 'totalCustomers' as const,
    value: '156',
    change: '+5',
    trend: 'up',
    icon: Users,
    color: 'accent',
  },
  {
    titleKey: 'todaysIncome' as const,
    value: '₹18,500',
    change: '+15%',
    trend: 'up',
    icon: IndianRupee,
    color: 'success',
  },
  {
    titleKey: 'pendingPayments' as const,
    value: '₹42,300',
    change: '23 customers',
    trend: 'down',
    icon: AlertCircle,
    color: 'warning',
  },
  {
    titleKey: 'totalBuffaloes' as const,
    value: '18',
    change: '2 new',
    trend: 'up',
    icon: Milk,
    color: 'primary',
  },
];

const recentEntries = [
  { customer: 'Ramesh Kumar', quantity: '2L', time: '6:30 AM', amount: '₹150' },
  { customer: 'Lakshmi Devi', quantity: '1.5L', time: '6:45 AM', amount: '₹112' },
  { customer: 'Suresh Reddy', quantity: '3L', time: '7:00 AM', amount: '₹225' },
  { customer: 'Priya Sharma', quantity: '1L', time: '7:15 AM', amount: '₹75' },
  { customer: 'Venkat Rao', quantity: '2.5L', time: '7:30 AM', amount: '₹187' },
];

const AdminOverview: React.FC = () => {
  const { t, language } = useLanguage();

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'success':
        return 'bg-success/10 text-success';
      case 'accent':
        return 'bg-accent/10 text-accent';
      case 'warning':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t(stat.titleKey)}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'te' ? 'త్వరిత చర్యలు' : 
               language === 'hi' ? 'त्वरित कार्रवाई' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start btn-golden">
              <Milk className="mr-2 h-4 w-4" />
              {t('milkEntry')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              {language === 'te' ? 'కస్టమర్ జోడించు' : 
               language === 'hi' ? 'ग्राहक जोड़ें' : 'Add Customer'}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IndianRupee className="mr-2 h-4 w-4" />
              {language === 'te' ? 'చెల్లింపు సేకరించు' : 
               language === 'hi' ? 'भुगतान लें' : 'Collect Payment'}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertCircle className="mr-2 h-4 w-4" />
              {language === 'te' ? 'ధర నవీకరించు' : 
               language === 'hi' ? 'कीमत अपडेट करें' : 'Update Price'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {language === 'te' ? 'ఇటీవలి ఎంట్రీలు' : 
               language === 'hi' ? 'हाल की प्रविष्टियाँ' : 'Recent Entries'}
            </CardTitle>
            <Button variant="ghost" size="sm">
              {language === 'te' ? 'అన్నీ చూడండి' : 
               language === 'hi' ? 'सभी देखें' : 'View All'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEntries.map((entry, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{entry.customer}</p>
                      <p className="text-sm text-muted-foreground">{entry.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{entry.quantity}</p>
                    <p className="text-sm text-success">{entry.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'te' ? 'నెలవారీ ట్రెండ్' : 
               language === 'hi' ? 'मासिक रुझान' : 'Monthly Trend'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{language === 'te' ? 'చార్ట్ త్వరలో వస్తుంది' : 
                  language === 'hi' ? 'चार्ट जल्द आ रहा है' : 'Chart coming soon'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'te' ? 'ఆదాయం vs ఖర్చులు' : 
               language === 'hi' ? 'आय vs खर्च' : 'Income vs Expenses'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <IndianRupee className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{language === 'te' ? 'చార్ట్ త్వరలో వస్తుంది' : 
                  language === 'hi' ? 'चार्ट जल्द आ रहा है' : 'Chart coming soon'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
