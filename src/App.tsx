import React, { useState, useEffect } from 'react';

// --- TYPES ---
type Language = 'ar' | 'fr';

interface Product {
  id: number;
  name: { ar: string; fr: string };
  price: number;
  images: string[];
  stock: number;
  soldCount: number;
  badge: string; // Nouveau champ pour le badge promotionnel
}

// --- CONFIGURATION BACKEND ---
const BACKEND_ENDPOINT = 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec';

// --- PIXEL CONFIGURATION ---
const META_PIXEL_ID = '2015120555934116';
const TIKTOK_PIXEL_ID = 'D5JCC63C77U894MDA0BG';

// --- DECLARE GLOBAL ---
declare global {
  interface Window {
    fbq: any;
    ttq: any;
  }
}

// --- CTA VARIATIONS ---
const ctaVariations = {
  ar: [
    'تواصل معايا دابا فالواتساب',
    'الواتساب',
    'إشتري الان عبر الواتساب',
    'الواتساب لكي ارسل لك الالوان المتوفرة',
    'اطلب الان',
    'نعم اريد الشراء',
    'اضغط هنا للشراء',
    'تواصل معايا دابا فالواتساب',
    'إشتري الان'
  ],
  fr: [
    'Commander maintenant',
    'Acheter maintenant',
    'Cliquer ici pour passer la commande',
    'Discutter sur whatsapp maintenant',
    'Confirmer sur whatsapp',
    'Je suis intéressé',
    'Oui je veux ce produit',
    'Je veux ce produit',
    'Cliquer ici pour information sur whatsapp'
  ]
};

// --- COULEURS ---
const colors = {
  ar: [
    { name: 'الخشبي', hex: '#b1a791' },
    { name: 'البني', hex: '#8B7355' },
    { name: 'الابيض', hex: '#ffffff' },
    { name: 'الاسود', hex: '#000000' }
  ],
  fr: [
    { name: 'Beige', hex: '#b1a791' },
    { name: 'Marron', hex: '#8B7355' },
    { name: 'Blanc', hex: '#ffffff' },
    { name: 'Noir', hex: '#000000' }
  ]
};

// --- NUMÉROS WHATSAPP ---
const whatsappNumbers = ['212656454375'];

// --- BADGES PROMOTIONNELS ---
const promotionalBadges = [
  'عرض جد محدود',
  'هذا المنتج الاكثر مبيعا!',
  'هذا المنتج جد مطلوب!',
  'موديل جديد !',
  'موديل عصري وانيق!',
  'كمية جد محدودة!',
  'تخفيض 50%'
];

// --- PRODUITS (AYA supprimé, ordre: YAKOUT, FATY, QUEEN) ---
const productsData: Product[] = [
  {
    id: 2,
    name: { ar: 'كوافوز YAKOUT', fr: 'COIFFEUSE YAKOUT' },
    price: 749,
    images: [
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/vTmczULSFXsWKM1LbCk1iAdMDMzxVLzWOW7aoz78_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/VAPqSklbdtWjPeZ1GrHlDTi2yxnZSpd9NxPtJiy3_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/1n3ZoZ5ISwib9Dt9inRh9DlDuXrUbAKwAYGie7wB_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/FxN8UJU6PiV0AfqfIktbHZYvj31lI3tvcvAG7TUA_lg.png'
    ],
    stock: Math.floor(Math.random() * 4) + 3,
    soldCount: Math.floor(Math.random() * 501) + 400,
    badge: promotionalBadges[0]
  },
  {
    id: 4,
    name: { ar: 'كــوافوز FATY', fr: 'COIFFEUSE FATY' },
    price: 679,
    images: [
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/lM1HZc2e1DLMcZ0f7rhJUo53icPobvLiId2U0I1b.webp',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/JyUWIz9QtG50wH47wq8q6AcKBUQKVnWMt44niECP.webp',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/inpwoZy2vAMKjV59cnOz7GNbpvFx95FUo5CU5Q6U.webp',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/DKXKXJNL5h0oodhh1xvzym3EHFcXjjew2AxUwQFl.webp'
    ],
    stock: Math.floor(Math.random() * 4) + 3,
    soldCount: Math.floor(Math.random() * 501) + 400,
    badge: promotionalBadges[1]
  },
  {
    id: 3,
    name: { ar: 'كوافوز QUEEN', fr: 'COIFFEUSE QUEEN' },
    price: 649,
    images: [
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/IknqY41xp51Tyirk3Vy8V07mo9jXXEXnHvSnSJ3i_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/z80nFUx58TBZJ1AKXwWuO38wUioYXmYpm1tTSp1E_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/8IBLfvyEO1LwGjziHDRz3rqvaxQZKUlMcUWmw09P_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/DWo7H90jQMNFufRfWouRAhvUbM5URh4BtpJayswy_lg.png'
    ],
    stock: Math.floor(Math.random() * 4) + 3,
    soldCount: Math.floor(Math.random() * 501) + 400,
    badge: promotionalBadges[2]
  }
];

// --- UTILS: GÉNÉRATION ET STOCKAGE ---
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const storeTrackingData = (fbclid: string | null, sessionId: string, whatsappNumber: string) => {
  localStorage.setItem('session_id', sessionId);
  localStorage.setItem('selected_whatsapp_number', whatsappNumber);
  
  if (fbclid) {
    localStorage.setItem('fbclid', fbclid);
  }
  
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `session_id=${sessionId}; expires=${expires}; path=/`;
  document.cookie = `selected_whatsapp_number=${whatsappNumber}; expires=${expires}; path=/`;
  
  if (fbclid) {
    document.cookie = `fbclid=${fbclid}; expires=${expires}; path=/`;
  }
};

const getStoredTrackingData = () => {
  const sessionId = localStorage.getItem('session_id') || '';
  const whatsappNumber = localStorage.getItem('selected_whatsapp_number') || whatsappNumbers[0];
  const fbclid = localStorage.getItem('fbclid') || '';
  
  return { sessionId, whatsappNumber, fbclid };
};

// ═══════════════════════════════════════════════════════════
// 📊 META PIXEL FUNCTIONS
// ═══════════════════════════════════════════════════════════

const initMetaPixel = () => {
  if (!META_PIXEL_ID || META_PIXEL_ID === 'YOUR_META_PIXEL_ID') {
    console.warn('⚠️ Meta Pixel ID non configuré');
    return;
  }

  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${META_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
};

const trackMetaEvent = (eventName: string, parameters = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
      console.log(`✅ Meta Event: ${eventName}`, parameters);
    } else {
      console.log(`⚠️ Meta Event (non envoyé): ${eventName}`, parameters);
    }
  } catch (error) {
    console.error('❌ Erreur Meta tracking:', error);
  }
};

const trackMetaPageView = () => {
  trackMetaEvent('PageView', {
    content_name: 'DECOREL Landing Page',
    content_category: 'Furniture',
    currency: 'MAD',
    value: 0
  });
};

const trackMetaViewContent = (productName: string, productPrice: number) => {
  trackMetaEvent('ViewContent', {
    content_name: productName,
    content_type: 'product',
    currency: 'MAD',
    value: productPrice
  });
};

const trackMetaContact = (productName: string, productPrice: number) => {
  trackMetaEvent('Contact', {
    content_name: productName,
    content_type: 'product',
    currency: 'MAD',
    value: productPrice,
    contact_method: 'whatsapp'
  });
};

const trackMetaPurchase = (productName: string, productPrice: number, transactionId: string) => {
  trackMetaEvent('Purchase', {
    content_name: productName,
    content_type: 'product',
    currency: 'MAD',
    value: productPrice,
    transaction_id: transactionId,
    num_items: 1
  });
};

// ═══════════════════════════════════════════════════════════
// 🎵 TIKTOK PIXEL FUNCTIONS
// ═══════════════════════════════════════════════════════════

const trackTikTokEvent = (eventName: string, properties = {}) => {
  try {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track(eventName, properties);
      console.log(`✅ TikTok Event: ${eventName}`, properties);
    } else {
      console.log(`⚠️ TikTok Event (non envoyé): ${eventName}`, properties);
    }
  } catch (error) {
    console.error('❌ Erreur TikTok tracking:', error);
  }
};

const trackTikTokPageView = () => {
  trackTikTokEvent('Browse', {
    content_type: 'product_group',
    content_name: 'DECOREL Landing Page'
  });
};

const trackTikTokViewContent = (productName: string, productPrice: number, productId: string) => {
  trackTikTokEvent('ViewContent', {
    content_type: 'product',
    content_id: productId,
    content_name: productName,
    value: productPrice,
    currency: 'MAD',
    quantity: 1
  });
};

const trackTikTokContact = (productName: string, productPrice: number, productId: string) => {
  trackTikTokEvent('Contact', {
    content_type: 'product',
    content_id: productId,
    content_name: productName,
    value: productPrice,
    currency: 'MAD',
    quantity: 1,
    description: 'WhatsApp Contact'
  });
};

const trackTikTokPurchase = (productName: string, productPrice: number, productId: string, transactionId: string) => {
  trackTikTokEvent('CompletePayment', {
    content_type: 'product',
    content_id: productId,
    content_name: productName,
    value: productPrice,
    currency: 'MAD',
    quantity: 1,
    order_id: transactionId
  });
};

// ═══════════════════════════════════════════════════════════
// 📡 TRACKING SERVICE UNIFIÉ
// ═══════════════════════════════════════════════════════════

const trackClickToWhatsApp = async (data: {
  fbclid: string;
  sessionId: string;
  productName: string;
  productId: string;
  productPrice: number;
  currency: string;
  language: string;
  whatsappNumber: string;
  userAgent: string;
  timestamp: number;
}) => {
  try {
    // 1. Tracking Meta - Contact Event
    trackMetaContact(data.productName, data.productPrice);

    // 2. Tracking TikTok - Contact Event ✅
    trackTikTokContact(data.productName, data.productPrice, data.productId);

    // 3. Backend tracking
    const payload = {
      event_type: 'whatsapp_click',
      ...data,
    };

    fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(error => {
      console.log('📤 Tracking envoyé (no-cors mode)');
    });

    console.log('✅ WhatsApp Click Tracked (Meta + TikTok):', {
      sessionId: data.sessionId.substring(0, 10) + '...',
      productName: data.productName,
      productPrice: data.productPrice,
      currency: data.currency,
      whatsappNumber: data.whatsappNumber
    });

  } catch (error) {
    console.error('❌ Erreur tracking:', error);
  }
};

// ═══════════════════════════════════════════════════════════
// 🎨 COMPOSANTS UI
// ═══════════════════════════════════════════════════════════

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-md text-gray-800 p-3 rounded-full border-2 border-gray-800 shadow-2xl hover:bg-gray-800 hover:text-white transition-all duration-300 hover:-translate-y-1 active:scale-95"
          style={{ animation: 'bounce 2s infinite' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
};

const SmartHeader = ({ language, onLanguageChange }: { language: Language; onLanguageChange: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (currentScrollY / pageHeight) * 100;

      // Afficher le header seulement si on est à moins de 5% du top de la page
      if (scrollPercentage < 5) {
        setIsVisible(true);
      } 
      // Masquer le header en scrollant vers le bas
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-300 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center relative">
        <img 
          src="https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/others/wjGs4dLMgdmpRz5mH5cuoQtNQSI9ii22LWfVkDuA.png"
          alt="DECOREL"
          className="h-10 w-auto"
        />
        
        <button
          onClick={onLanguageChange}
          className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg transition-all hover:bg-gray-900 active:scale-95`}
        >
          {language === 'ar' ? <><span>FR</span> 🇫🇷</> : <><span>AR</span> 🇲🇦</>}
        </button>
      </div>
    </header>
  );
};

const FeaturesHero = ({ language }: { language: Language }) => (
  <div className="relative max-w-6xl mx-auto px-3 py-8">
    {/* Call to action - Design radical court et percutant */}
    <div className="relative group max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
        
        {/* Effet brillant animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <div className="relative px-6 py-4 flex items-center justify-between gap-4">
          {/* Côté gauche - Emoji et texte */}
          <div className="flex items-center gap-3">
            <span className="text-5xl animate-bounce drop-shadow-lg">🎁</span>
            <div>
              <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-1">
                {language === 'ar' ? 'اختر موديلك المفضل' : 'Choisissez votre modèle'}
              </h3>
              <p className="text-yellow-100 font-bold text-xs md:text-sm">
                {language === 'ar' ? 'عرض محدود جداً!' : 'Offre très limitée!'}
              </p>
            </div>
          </div>

          {/* Côté droit - Flèche animée */}
          <div className="hidden md:block">
            <svg 
              className="w-12 h-12 text-white drop-shadow-lg animate-bounce" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Flèche mobile */}
          <div className="md:hidden">
            <svg 
              className="w-8 h-8 text-white drop-shadow-lg animate-bounce" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Bordure brillante animée */}
        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
      </div>
    </div>
  </div>
);

const ProductCard = ({ 
  product, 
  language, 
  ctaText, 
  trackingData 
}: { 
  product: Product; 
  language: Language; 
  ctaText: string;
  trackingData: {
    sessionId: string;
    whatsappNumber: string;
    fbclid: string;
  };
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [product.images.length, autoPlay]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackMetaViewContent(product.name[language], product.price);
      trackTikTokViewContent(product.name[language], product.price, `product_${product.id}`);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [product.id, language]);

  const handleWhatsAppClick = () => {
    trackClickToWhatsApp({
      fbclid: trackingData.fbclid,
      sessionId: trackingData.sessionId,
      productName: product.name[language],
      productId: `product_${product.id}`,
      productPrice: product.price,
      currency: 'MAD',
      language: language,
      whatsappNumber: trackingData.whatsappNumber,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });

    const message = language === 'ar'
      ? `السلام عليكم، أريد معلومات عن ${product.name.ar}`
      : `Bonjour, je veux des informations sur ${product.name.fr}`;
    
    const url = `https://wa.me/${trackingData.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoPlay(false);
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoPlay(false);
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  return (
    <div 
      onClick={handleWhatsAppClick}
      className="relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] border-2 border-gray-200 hover:border-green-400 cursor-pointer group"
    >
      {/* Effet de glow au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Badge "Cliquez ici" qui pulse */}
      <div className="absolute top-4 left-4 z-20 bg-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg animate-pulse">
        {language === 'ar' ? '👈 إضغط هنا' : '👆 Cliquez ici'}
      </div>

      <div className="relative w-full h-[340px] bg-gray-100 overflow-hidden">
        {product.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={product.name[language]}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ))}
        
        {/* Overlay au hover avec icône WhatsApp */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300 bg-[#25D366] rounded-full p-4 shadow-2xl">
            <svg className="w-12 h-12 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </div>

        {/* Boutons de navigation des images */}
        <button
          onClick={handlePrevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
          aria-label="Image précédente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
          aria-label="Image suivante"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Indicateurs d'images - maintenant cliquables */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setAutoPlay(false);
                setCurrentImageIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>

        {/* Badge promotionnel dynamique */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 rounded-xl font-black text-xs shadow-2xl animate-pulse border-2 border-red-800">
          <div className="flex items-center gap-1">
            <span className="text-yellow-300">⚡</span>
            <span>{product.badge}</span>
          </div>
        </div>
      </div>

      <div className="relative p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-600 transition-colors">
          {product.name[language]}
        </h3>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
            {language === 'ar' ? 'الالوان المتوفرة' : 'Couleurs disponibles'}
          </p>
          <div className="flex justify-center gap-3">
            {colors[language].map((color, idx) => (
              <div key={idx} className="group/color relative">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-md hover:scale-125 transition-transform cursor-pointer hover:border-green-500 hover:shadow-xl"
                  style={{ 
                    background: color.hex,
                    boxShadow: color.hex === '#ffffff' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.3)'
                  }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                  {color.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-5xl font-black text-gray-900 leading-none group-hover:text-green-600 transition-colors">
            {product.price}
            <span className="text-xl ml-1 text-gray-600">{language === 'ar' ? 'درهم' : 'DH'}</span>
          </p>
        </div>

        {/* Bouton WhatsApp avec animations attractives */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleWhatsAppClick();
          }}
          className={`relative w-full bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#1da851] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 overflow-hidden group/btn shadow-2xl hover:shadow-3xl border-2 border-green-600 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
        >
          {/* Effet de vague animé */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          
          {/* Effet de pulsation */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping" style={{ animationDuration: '2s' }} />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            
            <span className="text-lg font-black tracking-wide">
              {ctaText}
            </span>
            
            <svg className="w-6 h-6 opacity-90 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

const Footer = ({ language }: { language: Language }) => (
  <footer className="mt-10 bg-gray-50 border-t border-gray-300">
    <div className="max-w-6xl mx-auto px-4 py-8 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-300 shadow-sm">
          <span className="text-green-600 text-lg">📍</span>
          <span className="font-semibold text-gray-800 text-sm">
            {language === 'ar' ? 'أكادير، المغرب' : 'Agadir, Maroc'}
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-5 flex-wrap text-xs">
        <a href="https://decorel.shop/pages/confidentiality" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
          {language === 'ar' ? 'الخصوصية' : 'Confidentialité'}
        </a>
        <span className="text-gray-400">•</span>
        <a href="https://decorel.shop/pages/shipping-delivery" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
          {language === 'ar' ? 'التوصيل والإسترجاع' : 'Livraison & Retour'}
        </a>
      </div>

      <div className="border-t border-gray-300 pt-4">
        <p className="text-gray-500 text-xs mb-1">
          © 2026 DECOREL - {language === 'ar' ? 'جميع الحقوق محفوظة' : 'Tous droits réservés'}
        </p>
        <p className="text-gray-400 text-[10px]">
          {language === 'ar' ? 'صناعة مغربية 100%' : 'Fabrication 100% Marocaine'}
        </p>
      </div>
    </div>
  </footer>
);

const PixelInitializer = () => {
  useEffect(() => {
    initMetaPixel();
    trackMetaPageView();
    trackTikTokPageView();
    
    console.log('✅ Pixels initialisés:', {
      Meta: META_PIXEL_ID,
      TikTok: TIKTOK_PIXEL_ID
    });
    
    if (process.env.NODE_ENV === 'development') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'p' || e.key === 'P') {
          const randomProduct = productsData[Math.floor(Math.random() * productsData.length)];
          const transactionId = `TEST_${Date.now()}`;
          trackMetaPurchase(randomProduct.name.fr, randomProduct.price, transactionId);
          trackTikTokPurchase(randomProduct.name.fr, randomProduct.price, `product_${randomProduct.id}`, transactionId);
          alert('✅ Purchase Event simulé (Meta + TikTok)');
        }
      };
      window.addEventListener('keypress', handleKeyPress);
      return () => window.removeEventListener('keypress', handleKeyPress);
    }
    
  }, []);
  
  return null;
};

function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedCta, setSelectedCta] = useState('');
  const [trackingData, setTrackingData] = useState({
    sessionId: '',
    whatsappNumber: '',
    fbclid: ''
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');

    const storedData = getStoredTrackingData();
    let sessionId = storedData.sessionId;
    let whatsappNumber = storedData.whatsappNumber;
    
    if (!sessionId) {
      sessionId = generateSessionId();
    }
    
    if (!whatsappNumber) {
      whatsappNumber = whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)];
    }

    storeTrackingData(fbclid, sessionId, whatsappNumber);

    setTrackingData({
      sessionId,
      whatsappNumber,
      fbclid: fbclid || storedData.fbclid || ''
    });

    const randomCtaIndex = Math.floor(Math.random() * ctaVariations.ar.length);
    setSelectedCta(ctaVariations.ar[randomCtaIndex]);

    console.log('🎯 Tracking Initialisé:', {
      sessionId: sessionId.substring(0, 15) + '...',
      whatsappNumber: whatsappNumber,
      fbclid: fbclid ? fbclid.substring(0, 8) + '...' : 'none'
    });

  }, []);

  useEffect(() => {
    if (selectedCta) {
      const randomIndex = Math.floor(Math.random() * ctaVariations[language].length);
      setSelectedCta(ctaVariations[language][randomIndex]);
    }
  }, [language]);

  const handleLanguageChange = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        
        body {
          font-family: ${language === 'ar' ? "'Cairo', sans-serif" : "system-ui, sans-serif"};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      <PixelInitializer />
      
      <noscript>
        <img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} alt="" />
      </noscript>

      <SmartHeader language={language} onLanguageChange={handleLanguageChange} />

      {/* Padding top pour compenser le header fixe */}
      <div className="pt-20">
        <FeaturesHero language={language} />

        <main className="max-w-6xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productsData.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                ctaText={selectedCta}
                trackingData={trackingData}
              />
            ))}
          </div>
        </main>

        <Footer language={language} />
        <ScrollToTop />
      </div>
    </div>
  );
}

export default App;