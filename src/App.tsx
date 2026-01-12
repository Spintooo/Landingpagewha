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

// --- CONFIGURATION ---
const FB_PIXEL_ID = '839374849944404';

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
    'Je suis interessé',
    'Oui je veux ce produit',
    'Je veux ce produit',
    'Cliquer ici pour information sur whatsapp'
  ]
};

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

const whatsappNumbers = ['212658015287', '212713411065'];

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
    stock: 0,
    soldCount: 0
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
    stock: 0,
    soldCount: 0
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
    stock: 0,
    soldCount: 0
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
    stock: 0,
    soldCount: 0
  }
];

// --- FACEBOOK PIXEL HELPER ---
declare global {
  interface Window {
    fbq: any;
  }
}

// --- UTILS: SESSION & TRACKING ---
const generateSessionId = () => {
  return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// --- COMPOSANT: SCROLL TO TOP ---
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => window.pageYOffset > 300 ? setIsVisible(true) : setIsVisible(false);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur text-[#064e3b] p-3 rounded-full border-2 border-[#064e3b] shadow-xl hover:bg-[#064e3b] hover:text-white transition-all duration-300 animate-bounce"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </button>
      )}
    </>
  );
};

// --- COMPOSANT: FEATURES HERO (DARK THEME) ---
const FeaturesHero = ({ language }: { language: Language }) => (
  <div className="relative max-w-5xl mx-auto px-3 py-5">
    <div className="relative bg-[#064e3b] rounded-2xl overflow-hidden shadow-2xl border border-[#0f765e]">
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="relative z-10 p-5">
        {/* Title */}
        <div className="text-center mb-5">
          <div className="inline-block px-6 py-1.5 rounded-full bg-[#0f765e]/50 border border-[#fbbf24]/30 backdrop-blur-sm">
            <h2 className="text-[#fbbf24] text-xl font-black tracking-wide" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {language === 'ar' ? '✨ الجودة و الضمان مع ديكوريل' : '✨ Qualité & Garantie DECOREL'}
            </h2>
          </div>
        </div>

        {/* Grid Features */}
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto mb-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/10 shadow-lg transform hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 rounded-full bg-[#fbbf24] flex items-center justify-center text-xl shadow-inner shrink-0">🤝</div>
            <div className="text-right flex-1">
              <p className="text-white font-bold text-sm leading-tight">{language === 'ar' ? 'الدفع بعد الاستلام' : 'Paiement à la livraison'}</p>
              <p className="text-white/60 text-[10px]">{language === 'ar' ? 'عاين سلعتك عاد خلص' : 'Vérifiez avant de payer'}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/10 shadow-lg transform hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 rounded-full bg-[#fbbf24] flex items-center justify-center text-xl shadow-inner shrink-0">🚚</div>
            <div className="text-right flex-1">
              <p className="text-white font-bold text-sm leading-tight">{language === 'ar' ? 'توصيل سريع ومجاني' : 'Livraison Rapide Gratuite'}</p>
              <p className="text-white/60 text-[10px]">{language === 'ar' ? 'إلى جميع مدن المغرب' : 'Partout au Maroc'}</p>
            </div>
          </div>
        </div>

        {/* Scroll Animation */}
        <div className="text-center mt-2">
          <p className="text-white/80 text-[11px] font-bold mb-1 animate-pulse">
            {language === 'ar' ? '👇 اكتشف العروض الحصرية' : '👇 Découvrez nos offres'}
          </p>
          <div className="flex justify-center flex-col items-center -space-y-2 opacity-80">
            <svg className="w-5 h-5 text-[#fbbf24] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
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
  whatsappNumber,
  trackingData,
  sessionId 
}: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [product.images.length]);

  const handleWhatsAppClick = () => {
    // 1. Pixel Tracking
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', {
        content_name: product.name[language],
        content_ids: [product.id],
        value: product.price,
        currency: 'MAD'
      });
    }

    // 2. Data Payload (Pour Backend/Sheet)
    const payload = {
      event: 'click_whatsapp',
      sessionId: sessionId,
      fbclid: trackingData.fbclid,
      product: product.name[language],
      price: product.price,
      currency: 'MAD',
      language: language,
      whatsappNumber: whatsappNumber,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    // Simulation envoi backend (à remplacer par fetch vers votre API/Apps Script)
    console.log('🚀 Sending to Backend:', payload);

    // 3. Construction Message
    let message = language === 'ar'
      ? `سلام، عندي سؤال بخصوص ${product.name.ar}`
      : `Bonjour, je suis interessé par le ${product.name.fr}`;
    
    // Ajout FBCLID discret (Optionnel pour matching)
    if (trackingData.fbclid) {
      message += ` [Ref: ${trackingData.fbclid.substring(0,6)}]`;
    }
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    // BORDURE GRIS FONCÉ
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
      {/* GALLERY */}
      <div className="relative w-full h-[350px] bg-gray-50 overflow-hidden border-b border-gray-100">
        {product.images.map((img: string, idx: number) => (
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
        
        {/* Scarcity Badge */}
        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-lg animate-pulse z-10 border border-white/20">
          {language === 'ar' ? `⚡ فقط ${product.stock} قطع` : `⚡ Reste ${product.stock}`}
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {product.images.map((_: any, idx: number) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/60'}`} />
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center leading-tight">
          {product.name[language]}
        </h3>

        {/* COULEURS */}
        <div className="mb-3">
          <div className="flex justify-center items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              {language === 'ar' ? 'الألوان:' : 'COULEURS:'}
            </span>
            <div className="flex gap-1.5">
              {colors[language].map((color, idx) => (
                <div 
                  key={idx} 
                  className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                  style={{ background: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* PRIX */}
        <div className="text-center mb-4">
          <p className="text-4xl font-extrabold text-[#064e3b] leading-none tracking-tight">
            {product.price}
            <span className="text-lg ml-1 font-bold text-gray-500">{language === 'ar' ? 'درهم' : 'DH'}</span>
          </p>
        </div>

        {/* CTA BUTTON (Black Shadow) */}
        <button
          onClick={handleWhatsAppClick}
          className={`w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] ${language === 'ar' ? 'flex-row-reverse' : ''}`}
        >
          <svg className="w-6 h-6 fill-current drop-shadow-sm" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="text-base font-bold relative z-10 tracking-wide">
            {ctaText}
          </span>
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
  <footer className="mt-12 bg-[#f8fafc] border-t border-gray-200">
    <div className="max-w-6xl mx-auto px-4 py-8 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-gray-200 shadow-sm">
          <span className="text-xl">📍</span>
          <span className="font-bold text-gray-800 text-sm">
            {language === 'ar' ? 'أكادير، المغرب' : 'Agadir, Maroc'}
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-5 flex-wrap text-xs text-gray-500 font-medium">
        <a href="https://decorel.shop/pages/confidentiality" className="hover:text-gray-900 transition-colors">
          {language === 'ar' ? 'الخصوصية' : 'Confidentialité'}
        </a>
        <span>•</span>
        <a href="https://decorel.shop/pages/shipping-delivery" className="hover:text-gray-900 transition-colors">
          {language === 'ar' ? 'التوصيل والإسترجاع' : 'Livraison & Retour'}
        </a>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-gray-400 text-[10px]">
          © 2026 DECOREL - {language === 'ar' ? 'جميع الحقوق محفوظة' : 'Tous droits réservés'}
        </p>
      </div>
    </div>
  </footer>
);

// --- APP PRINCIPALE ---
function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedCta, setSelectedCta] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);
  const [trackingData, setTrackingData] = useState<{ fbclid?: string }>({});
  const [sessionId, setSessionId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Session ID & Pixel Init
    const sessId = localStorage.getItem('decorel_sess_id') || generateSessionId();
    localStorage.setItem('decorel_sess_id', sessId);
    setSessionId(sessId);

    // Pixel Script
    (function(f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
      if (f.fbq) return;
      n = f.fbq = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', FB_PIXEL_ID);
    window.fbq('track', 'PageView');

    // 2. Tracking URL (fbclid)
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      setTrackingData({ fbclid });
      localStorage.setItem('fbclid', fbclid);
    }

    // 3. Produits Aléatoires (Stock & SoldCount dynamiques)
    const shuffled = productsData.map(p => ({
      ...p,
      stock: Math.floor(Math.random() * (6 - 3 + 1)) + 3,
      soldCount: Math.floor(Math.random() * (4300 - 2000 + 1)) + 2000
    })).sort(() => Math.random() - 0.5);
    setShuffledProducts(shuffled);

    // 4. ViewContent Pixel
    shuffled.forEach(product => {
      window.fbq('track', 'ViewContent', { 
        content_name: product.name.ar, 
        content_ids: [product.id], 
        value: product.price, 
        currency: 'MAD' 
      });
    });

    // 5. Config Aléatoire (CTA & Numéro)
    setSelectedCta(ctaVariations.ar[Math.floor(Math.random() * ctaVariations.ar.length)]);
    setSelectedNumber(whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)]);

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (selectedCta) {
      const idx = Math.floor(Math.random() * ctaVariations[language].length);
      setSelectedCta(ctaVariations[language][idx]);
    }
  }, [language]);

  if (!isLoaded) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`body { font-family: ${language === 'ar' ? "'Almarai', sans-serif" : "system-ui, sans-serif"}; }`}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center relative">
          
          {/* BOUTON LANGUE */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
            className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors border border-gray-200 text-gray-700`}
          >
            {language === 'ar' ? <>FR 🇫🇷</> : <>AR 🇲🇦</>}
          </button>

          {/* LOGO */}
          <img 
            src="https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/others/wjGs4dLMgdmpRz5mH5cuoQtNQSI9ii22LWfVkDuA.png"
            alt="DECOREL"
            className="h-10 w-auto object-contain"
          />
        </div>
      </header>

      {/* HERO SECTION */}
      <FeaturesHero language={language} />

      {/* PRODUCTS GRID */}
      <main className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {shuffledProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              language={language}
              ctaText={selectedCta}
              whatsappNumber={selectedNumber}
              trackingData={trackingData}
              sessionId={sessionId}
            />
          ))}
        </div>
      </main>

      <Footer language={language} />
      <ScrollToTop />

      <noscript>
        <img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`} />
      </noscript>
    </div>
  );
}

export default App;