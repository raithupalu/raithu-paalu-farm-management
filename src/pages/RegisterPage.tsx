import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Milk, Eye, EyeOff, ArrowRight, Phone, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { register, user } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !phone || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: language === 'te' ? 'లోపం' : language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'te' ? 'దయచేసి అన్ని ఫీల్డ్‌లను నింపండి' : 
                     language === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill in all fields',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: language === 'te' ? 'లోపం' : language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'te' ? 'చెల్లుబాటు అయ్యే ఇమెయిల్ నమోదు చేయండి' : 
                     language === 'hi' ? 'वैध ईमेल दर्ज करें' : 'Enter a valid email address',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: language === 'te' ? 'లోపం' : language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'te' ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు' : 
                     language === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: language === 'te' ? 'లోపం' : language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'te' ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి' : 
                     language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षर होना चाहिए' : 'Password must be at least 6 characters',
      });
      return;
    }

    if (phone.length < 10) {
      toast({
        variant: "destructive",
        title: language === 'te' ? 'లోపం' : language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'te' ? 'చెల్లుబాటు అయ్యే ఫోన్ నంబర్ నమోదు చేయండి' : 
                     language === 'hi' ? 'वैध फ़ोन नंबर दर्ज करें' : 'Enter a valid phone number',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await register(email, password, username, phone);
      
      if (!error) {
        toast({
          title: language === 'te' ? 'ఖాతా సృష్టించబడింది' : 
                 language === 'hi' ? 'खाता बनाया गया' : 'Account Created',
          description: language === 'te' ? 'దయచేసి మీ ఇమెయిల్‌ను ధృవీకరించండి' : 
                       language === 'hi' ? 'कृपया अपना ईमेल सत्यापित करें' : 'Please check your email to verify your account',
        });
        navigate('/login');
      } else {
        toast({
          variant: "destructive",
          title: language === 'te' ? 'నమోదు విఫలమైంది' : 
                 language === 'hi' ? 'पंजीकरण विफल' : 'Registration Failed',
          description: error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('errorOccurred'),
        description: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground max-w-lg">
            <Milk className="h-20 w-20 mx-auto mb-8 opacity-90" />
            <h2 className="font-display text-4xl font-bold mb-4">
              {language === 'te' ? 'మా కుటుంబంలో చేరండి' : 
               language === 'hi' ? 'हमारे परिवार में शामिल हों' : 
               'Join Our Family'}
            </h2>
            <p className="text-lg opacity-80">
              {language === 'te' ? 'ఈరోజే నమోదు చేసుకోండి మరియు ప్రతిరోజు తాజా పాల సేవలను ఆనందించండి' : 
               language === 'hi' ? 'आज ही रजिस्टर करें और हर रोज़ ताज़ा दूध सेवाओं का आनंद लें' : 
               'Register today and enjoy fresh milk services delivered to your doorstep every day'}
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-accent/5" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 bg-background">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Milk className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">{t('appName')}</span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              {t('createAccount')}
            </h1>
            <p className="text-muted-foreground">
              {language === 'te' ? 'ప్రారంభించడానికి మీ వివరాలను నమోదు చేయండి' : 
               language === 'hi' ? 'शुरू करने के लिए अपना विवरण दर्ज करें' : 
               'Enter your details to get started'}
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder={language === 'te' ? 'మీ పేరు నమోదు చేయండి' : 
                               language === 'hi' ? 'अपना नाम दर्ज करें' : 
                               'Enter your name'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'te' ? 'ఇమెయిల్' : language === 'hi' ? 'ईमेल' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={language === 'te' ? 'మీ ఇమెయిల్ నమోదు చేయండి' : 
                               language === 'hi' ? 'अपना ईमेल दर्ज करें' : 
                               'Enter your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone')}</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 btn-golden rounded-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? t('loading') : t('createAccount')}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-muted-foreground">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
