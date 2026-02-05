import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Milk,
  IndianRupee,
  Calendar,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getMilkStats, getPaymentStats, getMilkEntries } from '@/services/api';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

interface MilkEntry {
  _id: string;
  date: string;
  timeOfDay: string;
  quantity: number;
  fat?: number;
  rate?: number;
  totalAmount: number;
}

const UserProgress: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [milkEntries, setMilkEntries] = useState<MilkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<MilkEntry | null>(null);

  // Fetch all data
  const fetchData = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const entries = await getMilkEntries({ userId: user._id });
      setMilkEntries(entries);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id]);

  // Get unique months from entries
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    milkEntries.forEach(entry => {
      const date = parseISO(entry.date);
      months.add(format(date, 'yyyy-MM'));
    });
    // Sort months (most recent first)
    return Array.from(months)
      .sort((a, b) => b.localeCompare(a))
      .map(monthStr => parseISO(monthStr + '-01'));
  }, [milkEntries]);

  // Filter entries for selected month
  const monthlyEntries = useMemo(() => {
    return milkEntries.filter(entry => 
      isSameMonth(parseISO(entry.date), selectedMonth)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [milkEntries, selectedMonth]);

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const totalQuantity = monthlyEntries.reduce((sum, e) => sum + e.quantity, 0);
    const totalAmount = monthlyEntries.reduce((sum, e) => sum + e.totalAmount, 0);
    const daysCount = new Set(monthlyEntries.map(e => e.date)).size;
    return { totalQuantity, totalAmount, daysCount };
  }, [monthlyEntries]);

  // Get daily totals for calendar
  const dailyTotals = useMemo(() => {
    const totals: Record<string, { quantity: number; amount: number; entries: MilkEntry[] }> = {};
    monthlyEntries.forEach(entry => {
      const dateKey = entry.date;
      if (!totals[dateKey]) {
        totals[dateKey] = { quantity: 0, amount: 0, entries: [] };
      }
      totals[dateKey].quantity += entry.quantity;
      totals[dateKey].amount += entry.totalAmount;
      totals[dateKey].entries.push(entry);
    });
    return totals;
  }, [monthlyEntries]);

  // Generate calendar days for selected month
  const calendarDays = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  }, [selectedMonth]);

  const handlePreviousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    const next = subMonths(selectedMonth, -1);
    // Don't go beyond current month
    if (next <= new Date()) {
      setSelectedMonth(next);
    }
  };

  const handleDayClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const entries = dailyTotals[dateKey];
    if (entries && entries.entries.length > 0) {
      // Show the first entry for that day (or could show a modal with all entries)
      setSelectedDay(entries.entries[0]);
    }
  };

  const handleCloseDayDetail = () => {
    setSelectedDay(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Month Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {language === 'te' ? 'ప్రగతి' : language === 'hi' ? 'प्रगति' : 'My Progress'}
        </h1>
        
        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-[180px] justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {format(selectedMonth, 'MMMM yyyy')}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextMonth}
            disabled={isSameMonth(selectedMonth, new Date())}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'te' ? 'మొత్తం పాలు' : language === 'hi' ? 'कुल दूध' : 'Total Milk'}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {monthlyStats.totalQuantity.toFixed(1)} L
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {monthlyStats.daysCount} {language === 'te' ? 'రోజులు' : language === 'hi' ? 'दिन' : 'days'}
                </p>
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
                  {language === 'te' ? 'మొత్తం మొత్తం' : language === 'hi' ? 'कुल राशि' : 'Total Amount'}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹{monthlyStats.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(selectedMonth, 'MMMM yyyy')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'te' ? 'సగటు రోజు' : language === 'hi' ? 'औसत दिन' : 'Daily Average'}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {monthlyStats.daysCount > 0 
                    ? `${(monthlyStats.totalQuantity / monthlyStats.daysCount).toFixed(1)} L`
                    : '-'
                  }
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'te' ? 'ప్రతి రోజు' : language === 'hi' ? 'प्रति दिन' : 'per day'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'te' ? 'క్యాలెండర్' : language === 'hi' ? 'कैलेंडर' : 'Calendar'} - {format(selectedMonth, 'MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: calendarDays[0]?.getDay() || 0 }).map((_, index) => (
              <div key={`empty-${index}`} className="h-20" />
            ))}
            
            {/* Days of the month */}
            {calendarDays.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayData = dailyTotals[dateKey];
              const hasData = !!dayData;
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={dateKey}
                  onClick={() => handleDayClick(day)}
                  className={`
                    h-20 p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md
                    ${hasData 
                      ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' 
                      : 'bg-muted/50 border-transparent hover:bg-muted'
                    }
                    ${isToday ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {hasData && (
                      <Badge variant="secondary" className="text-xs">
                        {dayData.entries.length}x
                      </Badge>
                    )}
                  </div>
                  {hasData && (
                    <div className="mt-1">
                      <p className="text-xs font-semibold text-primary">
                        {dayData.quantity.toFixed(1)}L
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{dayData.amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Modal */}
      {selectedDay && (
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center justify-between">
              <span>
                {language === 'te' ? 'రోజు వివరాలు' : language === 'hi' ? 'दिन विवरण' : 'Day Details'} - 
                {format(parseISO(selectedDay.date), 'dd MMMM yyyy')}
              </span>
              <Button variant="ghost" size="icon" onClick={handleCloseDayDetail}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'te' ? 'మొత్తం పాలు' : language === 'hi' ? 'कुल दूध' : 'Total Milk'}
                </p>
                <p className="text-xl font-bold">
                  {dailyTotals[selectedDay.date]?.quantity.toFixed(1) || 0} L
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'te' ? 'మొత్తం' : language === 'hi' ? 'कुल' : 'Total'}
                </p>
                <p className="text-xl font-bold">
                  ₹{dailyTotals[selectedDay.date]?.amount.toLocaleString() || 0}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="font-medium">
                {language === 'te' ? 'ఎంట్రీలు' : language === 'hi' ? 'प्रविष्टियां' : 'Entries'}
              </p>
              {dailyTotals[selectedDay.date]?.entries.map(entry => (
                <div key={entry._id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium capitalize">
                      {entry.timeOfDay === 'morning' 
                        ? (language === 'te' ? 'ఉదయం' : language === 'hi' ? 'सुबह' : 'Morning') 
                        : (language === 'te' ? 'సాయంత్రం' : language === 'hi' ? 'शाम' : 'Evening')
                      }
                    </p>
                    {entry.fat && (
                      <p className="text-sm text-muted-foreground">
                        Fat: {entry.fat}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{entry.quantity} L</p>
                    <p className="text-sm text-muted-foreground">₹{entry.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'te' ? 'ఇటీవలి ఎంట్రీలు' : language === 'hi' ? 'हाल की प्रविष्टियां' : 'Recent Entries'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{language === 'te' ? 'ఎంట్రీలు లేవు' : language === 'hi' ? 'कोई प्रविष्टियां नहीं' : 'No entries for this month'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {monthlyEntries.slice(0, 10).map((entry) => (
                <div key={entry._id} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Milk className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{format(parseISO(entry.date), 'dd MMM yyyy')}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {entry.timeOfDay === 'morning' 
                          ? (language === 'te' ? 'ఉదయం' : language === 'hi' ? 'सुबह' : 'Morning') 
                          : (language === 'te' ? 'సాయంత్రం' : language === 'hi' ? 'शाम' : 'Evening')
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{entry.quantity} L</p>
                    <p className="text-sm text-muted-foreground">₹{entry.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProgress;
