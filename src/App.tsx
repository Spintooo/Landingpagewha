import React, { useState, useEffect } from 'react';

// --- TYPES ---
type Language = 'ar' | 'fr';

interface Product {
  id: number;
  name: { ar: string; fr: string };
  price: number;
  images: string[];
  stock: number;
  // soldCount removed from interface requirement as we don't display it anymore
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

// --- BADGE VARIATIONS (NOUVEAU) ---
const badgeVariations = {
  ar: [
    'عرض جد محدود',
    'هذا المنتج الاكثر مبيعا!',
    'هذا المنتج جد مطلوب!',
    'موديل جديد !',
    'موديل عصري وانيق!',
    'كمية جد محدودة!',
    'تخفيض 50%'
  ],
  fr: [
    'Offre très limitée',
    'Best-seller !',
    'Très demandé !',
    'Nouveau modèle !',
    'Modèle moderne !',
    'Quantité très limitée !',
    '-50% de réduction'
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

// --- PRODUITS (ORDRE MODIFIÉ: YAKOUT -> FATY -> QUEEN) ---
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
    stock: Math.floor(Math.random() * 4) + 3
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
    stock: Math.floor(Math.random() * 4) + 3
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
    stock: Math.floor(Math.random() * 4) + 3
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

// --- FEATURES HERO REFONDU (REFONT À ZERO) ---
const FeaturesHero = ({ language }: { language: Language }) => (
  <div className="max-w-6xl mx-auto px-4 py-8 mb-4">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          {language === 'ar' ? 'لماذا تختار DECOREL؟' : 'Pourquoi choisir DECOREL ?'}
        </h2>
        <div className="h-1 w-24 mx-auto bg-green-500 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Paiement */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-green-200 transition-colors">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl shadow-sm">
            🤝
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'ar' 
              ? 'تخلص حتى توصلك الطلبية ديالك و تقلبها مزيان' 
              : 'Payez uniquement à la réception et vérification du produit'}
          </p>
        </div>

        {/* Card 2: Qualité */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl shadow-sm">
            💎
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {language === 'ar' ? 'جودة عالية مضمونة' : 'Qualité Premium'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'ar' 
              ? 'تصميمات عصرية و خشب متين يدوم طويلاً' 
              : 'Designs modernes et matériaux durables de haute qualité'}
          </p>
        </div>

        {/* Card 3: Rapidité */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-yellow-200 transition-colors">
          <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 text-2xl shadow-sm">
            🚀
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {language === 'ar' ? 'توصيل سريع' : 'Livraison Rapide'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'ar' 
              ? 'توصيل لباب الدار في وقت قياسي لجميع المدن' 
              : 'Livraison à domicile rapide partout au Maroc'}
          </p>
        </div>
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
  const [badgeText, setBadgeText] = useState('');

  // Initialisation du badge aléatoire au montage
  useEffect(() => {
    const badges = badgeVariations[language];
    // On utilise l'ID produit pour avoir un "aléatoire stable" ou juste random pur
    const randomIdx = Math.floor(Math.random() * badges.length);
    setBadgeText(badges[randomIdx]);
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [product.images.length]);

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

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-300">
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

        {/* NOUVEAU BADGE AVEC TEXTE VARIABLE */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg animate-pulse border border-red-800">
          ⚡ {badgeText}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
          {product.name[language]}
        </h3>

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

        <div className="text-center mb-6">
          <p className="text-4xl font-extrabold text-gray-900 leading-none">
            {product.price}
            <span className="text-xl ml-1 text-gray-600">{language === 'ar' ? 'درهم' : 'DH'}</span>
          </p>
          {/* SUPPRIMÉ: Texte "Seulement X pièces restantes" sous le prix */}
        </div>

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

        {/* SUPPRIMÉ: Texte "+492 clients ont acheté ce modèle" */}
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
          const randomProduct = productsData[0]; // Just take first one for test
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
  // SUPPRIMÉ: State 'shuffledProducts' pour respecter l'ordre strict
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

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center relative">
          <img 
            src="https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/others/wjGs4dLMgdmpRz5mH5cuoQtNQSI9ii22LWfVkDuA.png"
            alt="DECOREL"
            className="h-10 w-auto"
          />
          
          <button
            onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
            className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg transition-all hover:bg-gray-900 active:scale-95`}
          >
            {language === 'ar' ? <><span>FR</span> 🇫🇷</> : <><span>AR</span> 🇲🇦</>}
          </button>
        </div>
      </header>

      <FeaturesHero language={language} />

      <main className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Utilisation directe de productsData pour garder l'ordre strict */}
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

      {/* SUPPRIMÉ: Bouton Flottant WhatsApp */}

      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 bg-black/90 text-white text-xs p-3 rounded-lg z-50 max-w-xs">
          <div className="font-bold mb-2 text-green-400">🔍 Tracking Debug</div>
          <div className="space-y-1">
            <div>Session: {trackingData.sessionId.substring(0, 10)}...</div>
            <div>WhatsApp: {trackingData.whatsappNumber}</div>
            <div>FBCLID: {trackingData.fbclid ? trackingData.fbclid.substring(0, 8) + '...' : 'none'}</div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="text-green-400">✅ Meta Pixel: {META_PIXEL_ID}</div>
              <div className="text-purple-400">✅ TikTok Pixel: {TIKTOK_PIXEL_ID}</div>
            </div>
            <div className="text-[10px] text-gray-400 mt-2">
              Press 'P' to test Purchase event
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;