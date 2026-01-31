import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Milk, Users, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import heroImage from '@/assets/hero-buffalo.jpg';

const features = [
  {
    icon: Milk,
    titleEn: 'Fresh Daily Delivery',
    titleTe: 'ప్రతిరోజు తాజా డెలివరీ',
    titleHi: 'दैनिक ताज़ा डिलीवरी',
    descEn: 'Pure buffalo milk delivered fresh every morning',
    descTe: 'ప్రతి ఉదయం తాజాగా డెలివరీ చేయబడే స్వచ్ఛమైన గేదె పాలు',
    descHi: 'हर सुबह ताज़ा डिलीवर होने वाला शुद्ध भैंस का दूध',
  },
  {
    icon: Users,
    titleEn: 'Subscription Management',
    titleTe: 'సబ్‌స్క్రిప్షన్ మేనేజ్‌మెంట్',
    titleHi: 'सब्सक्रिप्शन प्रबंधन',
    descEn: 'Flexible daily or alternate day subscriptions',
    descTe: 'సౌకర్యవంతమైన రోజువారీ లేదా ప్రత్యామ్నాయ రోజు సబ్‌స్క్రిప్షన్‌లు',
    descHi: 'लचीला दैनिक या वैकल्पिक दिन सब्सक्रिप्शन',
  },
  {
    icon: Truck,
    titleEn: 'Real-time Tracking',
    titleTe: 'రియల్-టైమ్ ట్రాకింగ్',
    titleHi: 'रीयल-टाइम ट्रैकिंग',
    descEn: 'Track your deliveries and consumption history',
    descTe: 'మీ డెలివరీలు మరియు వినియోగ చరిత్రను ట్రాక్ చేయండి',
    descHi: 'अपनी डिलीवरी और उपभोग इतिहास ट्रैक करें',
  },
  {
    icon: Shield,
    titleEn: 'Quality Assured',
    titleTe: 'నాణ్యత హామీ',
    titleHi: 'गुणवत्ता आश्वासन',
    descEn: 'Premium quality with health certifications',
    descTe: 'ఆరోగ్య సర్టిఫికేషన్‌లతో ప్రీమియం నాణ్యత',
    descHi: 'स्वास्थ्य प्रमाणपत्रों के साथ प्रीमियम गुणवत्ता',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const getFeatureText = (feature: typeof features[0], field: 'title' | 'desc') => {
    const langSuffix = language === 'te' ? 'Te' : language === 'hi' ? 'Hi' : 'En';
    return feature[`${field}${langSuffix}` as keyof typeof feature] as string;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Milk className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">{t('appName')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="hidden sm:flex"
            >
              {t('login')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 hero-overlay" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground/90">
                {t('trustedBy')}
              </span>
            </div>
            
            {/* Main Title */}
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
              {t('heroTitle')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-primary-foreground/80 font-light">
              {t('heroSubtitle')}
            </p>
            
            {/* Description */}
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              {t('heroDescription')}
            </p>
            
            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg"
                onClick={() => navigate('/login')}
                className="btn-golden text-lg px-8 py-6 rounded-full font-semibold"
              >
                {t('getStarted')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-2">
            <div className="w-1 h-3 rounded-full bg-primary-foreground/60" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              {language === 'te' ? 'మేము ఎందుకు ఎంచుకోవాలి' : 
               language === 'hi' ? 'हमें क्यों चुनें' : 'Why Choose Us'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'te' ? 'మీ కుటుంబానికి అత్యుత్తమ పాల అనుభవాన్ని అందించడానికి మేము కట్టుబడి ఉన్నాము' : 
               language === 'hi' ? 'हम आपके परिवार को सर्वोत्तम दूध अनुभव प्रदान करने के लिए प्रतिबद्ध हैं' : 
               'We are committed to delivering the best milk experience for your family'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="milk-card p-6 text-center stat-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {getFeatureText(feature, 'title')}
                </h3>
                <p className="text-muted-foreground">
                  {getFeatureText(feature, 'desc')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            {language === 'te' ? 'ఈరోజే మీ తాజా పాల ప్రయాణాన్ని ప్రారంభించండి' : 
             language === 'hi' ? 'आज ही अपनी ताज़ा दूध यात्रा शुरू करें' : 
             'Start Your Fresh Milk Journey Today'}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {language === 'te' ? 'వందలాది సంతృప్త కుటుంబాలతో చేరండి' : 
             language === 'hi' ? 'सैकड़ों संतुष्ट परिवारों से जुड़ें' : 
             'Join hundreds of satisfied families enjoying premium quality milk'}
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/register')}
            className="btn-golden text-lg px-8 py-6 rounded-full font-semibold"
          >
            {t('createAccount')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 {t('appName')}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
