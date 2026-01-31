import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Milk, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        variant: "destructive",
        title: language === 'te' ? 'లోపం' : language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'te' ? 'దయచేసి అన్ని ఫీల్డ్‌లను నింపండి' : 
                     language === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill in all fields',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: t('loginSuccess'),
          description: `${t('welcomeBack')}, ${username}!`,
        });
        
        // Navigate based on role (admin credentials: admin/admin123)
        if (username === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast({
          variant: "destructive",
          title: language === 'te' ? 'లాగిన్ విఫలమైంది' : 
                 language === 'hi' ? 'लॉगिन विफल' : 'Login Failed',
          description: language === 'te' ? 'తప్పు క్రెడెన్షియల్స్' : 
                       language === 'hi' ? 'गलत क्रेडेंशियल्स' : 'Invalid credentials',
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
      {/* Left Panel - Form */}
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
              {t('welcomeBack')}
            </h1>
            <p className="text-muted-foreground">
              {language === 'te' ? 'కొనసాగించడానికి మీ ఖాతాలోకి లాగిన్ అవ్వండి' : 
               language === 'hi' ? 'जारी रखने के लिए अपने खाते में लॉगिन करें' : 
               'Login to your account to continue'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={language === 'te' ? 'మీ యూజర్‌నేమ్ నమోదు చేయండి' : 
                             language === 'hi' ? 'अपना यूज़रनेम दर्ज करें' : 
                             'Enter your username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12"
              />
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  {t('rememberMe')}
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                {t('forgotPassword')}
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 btn-golden rounded-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? t('loading') : t('login')}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          {/* Admin hint */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>
                {language === 'te' ? 'అడ్మిన్ లాగిన్: admin / admin123' : 
                 language === 'hi' ? 'एडमिन लॉगिन: admin / admin123' : 
                 'Admin login: admin / admin123'}
              </span>
            </div>
          </div>

          {/* Register link */}
          <p className="mt-8 text-center text-muted-foreground">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground max-w-lg">
            <Milk className="h-20 w-20 mx-auto mb-8 opacity-90" />
            <h2 className="font-display text-4xl font-bold mb-4">
              {t('heroTitle')}
            </h2>
            <p className="text-lg opacity-80">
              {t('heroDescription')}
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10" />
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-accent/5" />
      </div>
    </div>
  );
};

export default LoginPage;
