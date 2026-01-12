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
}

// --- CONFIGURATION BACKEND ---
const BACKEND_ENDPOINT = 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec';

// --- PIXEL META CONFIGURATION ---
const META_PIXEL_ID = '2015120555934116'; // À remplacer par votre ID Pixel

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
const whatsappNumbers = ['212658015287', '212713411065'];

// --- PRODUITS ---
const productsData: Product[] = [
  {
    id: 1,
    name: { ar: 'كــوافوز AYA', fr: 'COIFFEUSE AYA' },
    price: 649,
    images: [
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/hlHsBOO56LXuTEgbEh8E8ScoUdm1BStF2Dc1f9og_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/9ZWT8UNNjIvg6k860BSHGwT4hw9NLhMRovu5bmcX_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/CrikpIn64uKs1ms3rR2dEudxy3fp0vq2oOlWgrND_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/CISZl1cyRVAsjbXQruBVxXNCfGECwbLWDdlSTOBi_lg.png'
    ],
    stock: Math.floor(Math.random() * 4) + 3,
    soldCount: Math.floor(Math.random() * 501) + 400
  },
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
    soldCount: Math.floor(Math.random() * 501) + 400
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
    soldCount: Math.floor(Math.random() * 501) + 400
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
    soldCount: Math.floor(Math.random() * 501) + 400
  }
];

// --- UTILS: GÉNÉRATION ET STOCKAGE ---
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const storeTrackingData = (fbclid: string | null, sessionId: string, whatsappNumber: string) => {
  // Stockage dans localStorage
  localStorage.setItem('session_id', sessionId);
  localStorage.setItem('selected_whatsapp_number', whatsappNumber);
  
  if (fbclid) {
    localStorage.setItem('fbclid', fbclid);
  }
  
  // Stockage dans cookies pour compatibilité
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

// --- META PIXEL HELPER FUNCTIONS ---
const initMetaPixel = () => {
  // Initialisation du pixel Meta
  if (!META_PIXEL_ID || META_PIXEL_ID === 'YOUR_META_PIXEL_ID') {
    console.warn('⚠️ Meta Pixel ID non configuré');
    return;
  }

  // Script du pixel Meta
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

// Fonctions pour tracker les événements Meta
const trackMetaEvent = (eventName: string, parameters = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
    console.log(`📊 Meta Event: ${eventName}`, parameters);
  } else {
    console.log(`📊 Meta Event (simulé): ${eventName}`, parameters);
  }
};

// Événements spécifiques
const trackPageView = () => {
  trackMetaEvent('PageView', {
    content_name: 'DECOREL Landing Page',
    content_category: 'Furniture',
    currency: 'MAD',
    value: 0
  });
};

const trackViewContent = (productName: string, productPrice: number) => {
  trackMetaEvent('ViewContent', {
    content_name: productName,
    content_type: 'product',
    currency: 'MAD',
    value: productPrice
  });
};

const trackContact = (productName: string, productPrice: number, method = 'whatsapp') => {
  trackMetaEvent('Contact', {
    content_name: productName,
    content_type: 'product',
    currency: 'MAD',
    value: productPrice,
    contact_method: method
  });
};

const trackPurchase = (productName: string, productPrice: number, transactionId: string) => {
  trackMetaEvent('Purchase', {
    content_name: productName,
    content_type: 'product',
    currency: 'MAD',
    value: productPrice,
    transaction_id: transactionId,
    num_items: 1
  });
};

// --- TRACKING SERVICE ---
const trackClickToWhatsApp = async (data: {
  fbclid: string;
  sessionId: string;
  productName: string;
  productPrice: number;
  currency: string;
  language: string;
  whatsappNumber: string;
  userAgent: string;
  timestamp: number;
}) => {
  try {
    // 1. Tracking Meta - Événement Contact
    trackContact(data.productName, data.productPrice, 'whatsapp');

    const payload = {
      event_type: 'whatsapp_click',
      ...data,
    };

    // Envoi asynchrone au backend
    fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(error => {
      console.log('Tracking envoyé (no-cors mode)');
    });

    // Log local pour débogage
    console.log('📊 WhatsApp Click Tracked:', {
      sessionId: data.sessionId,
      productName: data.productName,
      whatsappNumber: data.whatsappNumber,
      fbclid: data.fbclid ? data.fbclid.substring(0, 8) + '...' : 'none'
    });

  } catch (error) {
    console.error('Erreur tracking:', error);
  }
};

// --- COMPOSANT: SCROLL TO TOP BUTTON ---
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

// --- COMPOSANT: FEATURES HERO ---
const FeaturesHero = ({ language }: { language: Language }) => (
  <div className="relative max-w-5xl mx-auto px-3 py-4">
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-gray-600/20 to-transparent rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
        backgroundSize: '100px 100px'
      }} />

      <div className="relative z-10 p-5">
        <div className="text-center mb-4">
          <h2 className="text-white text-2xl font-black mb-1 tracking-tight" style={{ 
            textShadow: '0 2px 15px rgba(0,0,0,0.5)',
            lineHeight: 1.2,
            background: 'linear-gradient(to right, #ffffff, #e5e7eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {language === 'ar' ? 'لماذا تختار DECOREL؟' : 'Pourquoi DECOREL ?'}
          </h2>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center border border-green-500/30">
              <span className="text-2xl text-green-400">✓</span>
            </div>
            <p className="text-white text-sm font-bold leading-tight mb-1">
              {language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement sécurisé'}
            </p>
            <p className="text-gray-300 text-xs leading-tight">
              {language === 'ar' ? 'قلب بعد التأكد' : 'Payez en toute sécurité'}
            </p>
            <span className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full mt-2">
              {language === 'ar' ? '100% مضمون' : '100% Garanti'}
            </span>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
              <span className="text-2xl text-blue-400">⚡</span>
            </div>
            <p className="text-white text-sm font-bold leading-tight mb-1">
              {language === 'ar' ? 'تركيب في 5 دقائق' : 'Installation rapide'}
            </p>
            <p className="text-gray-300 text-xs leading-tight">
              {language === 'ar' ? 'بدون مجهود' : 'Sans difficulté'}
            </p>
            <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[10px] font-bold px-3 py-1 rounded-full mt-2">
              {language === 'ar' ? 'سهل جداً' : 'Très simple'}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-3 text-center border border-gray-700">
          <p className="text-white font-black text-sm leading-tight mb-1">
            {language === 'ar' ? 'إختر موديلك المفضل' : 'Choisissez votre modèle'}
          </p>
          <p className="text-green-300 text-xs font-semibold leading-tight">
            {language === 'ar' ? 'ألوان وأشكال متعددة' : 'Plusieurs couleurs disponibles'}
          </p>
          <div className="mt-2 flex justify-center">
            <svg 
              className="w-6 h-6 text-green-400" 
              style={{ animation: 'bounceDown 1.5s ease-in-out infinite' }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- COMPOSANT: CARTE PRODUIT ---
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [product.images.length]);

  // Track ViewContent quand le produit est visible
  useEffect(() => {
    // Délai pour s'assurer que l'utilisateur a vu le produit
    const timer = setTimeout(() => {
      trackViewContent(product.name[language], product.price);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [product.id, language]);

  const handleWhatsAppClick = () => {
    // 1. Tracking du clic WhatsApp
    trackClickToWhatsApp({
      fbclid: trackingData.fbclid,
      sessionId: trackingData.sessionId,
      productName: product.name[language],
      productPrice: product.price,
      currency: 'MAD',
      language: language,
      whatsappNumber: trackingData.whatsappNumber,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });

    // 2. Construction du message WhatsApp
    const message = language === 'ar'
      ? `السلام عليكم، أريد معلومات عن ${product.name.ar}`
      : `Bonjour, je veux des informations sur ${product.name.fr}`;
    
    // 3. Redirection WhatsApp
    const url = `https://wa.me/${trackingData.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-300">
      {/* GALLERY */}
      <div className="relative w-full h-[340px] bg-gray-100 overflow-hidden">
        {product.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={product.name[language]}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ))}
        
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {product.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg animate-pulse border border-red-800">
          {language === 'ar' ? `⚡ ${product.stock} قطع متبقية` : `⚡ ${product.stock} restants`}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
          {product.name[language]}
        </h3>

        {/* COULEURS */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
            {language === 'ar' ? 'الالوان المتوفرة' : 'Couleurs disponibles'}
          </p>
          <div className="flex justify-center gap-3">
            {colors[language].map((color, idx) => (
              <div key={idx} className="group relative">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ 
                    background: color.hex,
                    boxShadow: color.hex === '#ffffff' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.3)'
                  }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  {color.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRIX */}
        <div className="text-center mb-3">
          <p className="text-4xl font-extrabold text-gray-900 leading-none">
            {product.price}
            <span className="text-xl ml-1 text-gray-600">{language === 'ar' ? 'درهم' : 'DH'}</span>
          </p>
          <p className="text-red-600 text-xs font-bold mt-1">
            {language === 'ar' ? `فقط ${product.stock} قطع متبقية` : `Seulement ${product.stock} restants`}
          </p>
        </div>

        {/* CTA WHATSAPP */}
        <button
          onClick={handleWhatsAppClick}
          className={`w-full bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#1da851] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-95 relative overflow-hidden group ${language === 'ar' ? 'flex-row-reverse' : ''}`}
          style={{
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="relative z-10">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          
          <span className="text-base font-bold relative z-10 tracking-wide">
            {ctaText}
          </span>
          
          <svg className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* SOCIAL PROOF */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-600 font-semibold">
            {language === 'ar' 
              ? `+${product.soldCount.toLocaleString()} عميل إشترى هذا الموديل` 
              : `+${product.soldCount.toLocaleString()} clients ont acheté ce modèle`}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- FOOTER ---
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

// --- COMPOSANT: META PIXEL INITIALIZATION ---
const MetaPixel = () => {
  useEffect(() => {
    // Initialiser le pixel Meta
    initMetaPixel();
    
    // Track PageView
    trackPageView();
    
    // Track ViewContent pour la page globale
    trackViewContent('DECOREL Landing Page', 0);
    
    console.log('✅ Meta Pixel initialisé');
    
    // Fonction pour simuler un achat (pour test seulement - à enlever en prod)
    const simulatePurchaseForTesting = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧪 Test Purchase Event disponible - Appuyez sur P');
        const handleKeyPress = (e: KeyboardEvent) => {
          if (e.key === 'p' || e.key === 'P') {
            const randomProduct = productsData[Math.floor(Math.random() * productsData.length)];
            trackPurchase(
              randomProduct.name.fr,
              randomProduct.price,
              `TEST_${Date.now()}`
            );
            alert('✅ Purchase Event simulé pour test');
          }
        };
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
      }
    };
    
    simulatePurchaseForTesting();
    
  }, []);
  
  return null;
};

// --- APP PRINCIPALE ---
function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedCta, setSelectedCta] = useState('');
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);
  const [trackingData, setTrackingData] = useState({
    sessionId: '',
    whatsappNumber: '',
    fbclid: ''
  });

  // Initialisation du tracking
  useEffect(() => {
    // 1. Récupération du fbclid depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');

    // 2. Génération ou récupération de la session
    const storedData = getStoredTrackingData();
    let sessionId = storedData.sessionId;
    let whatsappNumber = storedData.whatsappNumber;
    
    if (!sessionId) {
      sessionId = generateSessionId();
    }
    
    if (!whatsappNumber) {
      // Sélection aléatoire d'un numéro WhatsApp
      whatsappNumber = whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)];
    }

    // 3. Stockage des données
    storeTrackingData(fbclid, sessionId, whatsappNumber);

    // 4. Mise à jour du state
    setTrackingData({
      sessionId,
      whatsappNumber,
      fbclid: fbclid || storedData.fbclid || ''
    });

    // 5. Shuffle des produits
    const shuffled = [...productsData].sort(() => Math.random() - 0.5);
    setShuffledProducts(shuffled);

    // 6. Sélection aléatoire d'un CTA
    const randomCtaIndex = Math.floor(Math.random() * ctaVariations.ar.length);
    setSelectedCta(ctaVariations.ar[randomCtaIndex]);

    // 7. Log pour débogage
    console.log('🎯 Tracking Initialisé:', {
      sessionId: sessionId.substring(0, 15) + '...',
      whatsappNumber: whatsappNumber,
      fbclid: fbclid ? fbclid.substring(0, 8) + '...' : 'none',
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    });

  }, []);

  // Mise à jour du CTA quand la langue change
  useEffect(() => {
    if (selectedCta) {
      const randomIndex = Math.floor(Math.random() * ctaVariations[language].length);
      setSelectedCta(ctaVariations[language][randomIndex]);
    }
  }, [language]);

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

      {/* META PIXEL */}
      <MetaPixel />
      
      {/* NOSCRIPT PIXEL FALLBACK */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center relative">
          <img 
            src="https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/others/wjGs4dLMgdmpRz5mH5cuoQtNQSI9ii22LWfVkDuA.png"
            alt="DECOREL"
            className="h-10 w-auto"
          />
          
          {/* Language Button */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
            className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg transition-all hover:bg-gray-900 active:scale-95`}
          >
            {language === 'ar' ? <><span>FR</span> 🇫🇷</> : <><span>AR</span> 🇲🇦</>}
          </button>
        </div>
      </header>

      {/* FEATURES HERO */}
      <FeaturesHero language={language} />

      {/* PRODUCTS GRID */}
      <main className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shuffledProducts.map((product) => (
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

      {/* FOOTER */}
      <Footer language={language} />
      
      {/* SCROLL TO TOP */}
      <ScrollToTop />

      {/* FLOATING WHATSAPP FOR MOBILE */}
      <div className="fixed bottom-4 left-4 md:hidden z-50">
        <button
          onClick={() => {
            const randomProduct = shuffledProducts[Math.floor(Math.random() * shuffledProducts.length)];
            
            // Tracking
            trackClickToWhatsApp({
              fbclid: trackingData.fbclid,
              sessionId: trackingData.sessionId,
              productName: randomProduct.name[language],
              productPrice: randomProduct.price,
              currency: 'MAD',
              language: language,
              whatsappNumber: trackingData.whatsappNumber,
              userAgent: navigator.userAgent,
              timestamp: Date.now(),
            });

            const message = language === 'ar'
              ? `السلام عليكم، أريد معلومات عن ${randomProduct.name.ar}`
              : `Bonjour, je veux des informations sur ${randomProduct.name.fr}`;
            
            const url = `https://wa.me/${trackingData.whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          className="bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:shadow-3xl transition-all"
          aria-label={language === 'ar' ? 'واتساب' : 'WhatsApp'}
          style={{
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>

      {/* Debug Info (Supprimer en production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 bg-black/80 text-white text-xs p-2 rounded-lg z-50 max-w-xs">
          <div className="font-bold mb-1">🔍 Tracking Debug</div>
          <div>Session: {trackingData.sessionId.substring(0, 10)}...</div>
          <div>WhatsApp: {trackingData.whatsappNumber}</div>
          <div>FBCLID: {trackingData.fbclid ? trackingData.fbclid.substring(0, 8) + '...' : 'none'}</div>
          <div className="mt-2 text-green-400">✅ Pixel Meta: Activé</div>
          <div className="text-[10px] text-gray-400 mt-1">
            Appuyez sur 'P' pour simuler un achat
          </div>
        </div>
      )}
    </div>
  );
}

export default App;