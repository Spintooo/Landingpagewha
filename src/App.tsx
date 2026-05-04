import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- TYPES ---
type Language = 'ar' | 'fr';
interface Product {
  id: number;
  name: { ar: string; fr: string };
  price: number;
  originalPrice: number;
  images: string[];
  stock: number;
  soldCount: number;
  badge: { ar: string; fr: string };
  colorId: string;
}

// --- CONFIG ---
const BACKEND_ENDPOINT = 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec';
const META_PIXEL_ID    = '2015120555934116';
const TIKTOK_PIXEL_ID  = 'D5JCC63C77U894MDA0BG';

declare global { interface Window { fbq: any; ttq: any; } }

const whatsappNumbers = ['212658015287','212658016050','212693221157','212658069643'];

const colors = {
  ar: [
    { name: 'الخشبي',  hex: '#c8b89a' },
    { name: 'البني',   hex: '#8B7355' },
    { name: 'الأبيض',  hex: '#f5f0eb' },
    { name: 'الأسود',  hex: '#1a1a1a' },
  ],
  fr: [
    { name: 'Beige',   hex: '#c8b89a' },
    { name: 'Marron',  hex: '#8B7355' },
    { name: 'Blanc',   hex: '#f5f0eb' },
    { name: 'Noir',    hex: '#1a1a1a' },
  ],
};

const productsData: Product[] = [
  {
    id: 2,
    name: { ar: 'كوافوز YAKOUT', fr: 'COIFFEUSE YAKOUT' },
    price: 749, originalPrice: 1199,
    images: [
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/vTmczULSFXsWKM1LbCk1iAdMDMzxVLzWOW7aoz78_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/VAPqSklbdtWjPeZ1GrHlDTi2yxnZSpd9NxPtJiy3_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/1n3ZoZ5ISwib9Dt9inRh9DlDuXrUbAKwAYGie7wB_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/FxN8UJU6PiV0AfqfIktbHZYvj31lI3tvcvAG7TUA_lg.png',
    ],
    stock: 4, soldCount: 847,
    badge: { ar: 'الأكثر مبيعاً ⭐', fr: 'Best-seller ⭐' },
    colorId: 'yakout',
  },
  {
    id: 4,
    name: { ar: 'كوافوز FATY', fr: 'COIFFEUSE FATY' },
    price: 679, originalPrice: 999,
    images: [
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/lM1HZc2e1DLMcZ0f7rhJUo53icPobvLiId2U0I1b.webp',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/JyUWIz9QtG50wH47wq8q6AcKBUQKVnWMt44niECP.webp',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/inpwoZy2vAMKjV59cnOz7GNbpvFx95FUo5CU5Q6U.webp',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/DKXKXJNL5h0oodhh1xvzym3EHFcXjjew2AxUwQFl.webp',
    ],
    stock: 3, soldCount: 612,
    badge: { ar: 'طلب محدود 🔥', fr: 'Stock limité 🔥' },
    colorId: 'faty',
  },
  {
    id: 3,
    name: { ar: 'كوافوز QUEEN', fr: 'COIFFEUSE QUEEN' },
    price: 649, originalPrice: 949,
    images: [
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/IknqY41xp51Tyirk3Vy8V07mo9jXXEXnHvSnSJ3i_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/z80nFUx58TBZJ1AKXwWuO38wUioYXmYpm1tTSp1E_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/8IBLfvyEO1LwGjziHDRz3rqvaxQZKUlMcUWmw09P_lg.png',
      'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/DWo7H90jQMNFufRfWouRAhvUbM5URh4BtpJayswy_lg.png',
    ],
    stock: 5, soldCount: 534,
    badge: { ar: 'موديل جديد ✨', fr: 'Nouveau modèle ✨' },
    colorId: 'queen',
  },
];

// ─── TRACKING ────────────────────────────────────────────────────────────────
const getCookie = (name: string) => {
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? m[2] : '';
};
const getTrackingPayload = () => {
  const fbclid = localStorage.getItem('fbclid') || '';
  const fbp    = getCookie('_fbp') || '';
  const fbc    = getCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : '');
  return { fbclid, fbp, fbc, userAgent: navigator.userAgent, clientIp: localStorage.getItem('clientIp') || '' };
};
const trackMetaEvent = (name: string, params: object = {}) => {
  try { if (window.fbq) window.fbq('track', name, params); } catch {}
};
const trackTTEvent = (name: string, params: object = {}) => {
  try { if (window.ttq) window.ttq.track(name, params); } catch {}
};

// ─── PIXEL INIT ──────────────────────────────────────────────────────────────
const PixelInit = () => {
  useEffect(() => {
    // Meta Pixel
    const s = document.createElement('script');
    s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;
    document.head.appendChild(s);
    // Capture fbclid
    const fbclid = new URLSearchParams(window.location.search).get('fbclid');
    if (fbclid) localStorage.setItem('fbclid', fbclid);
    // Capture IP
    fetch('https://api.ipify.org?format=json').then(r=>r.json()).then(d=>localStorage.setItem('clientIp',d.ip)).catch(()=>{});
  }, []);
  return null;
};

// ─── SOCIAL PROOF TOAST ──────────────────────────────────────────────────────
const cities = ['الدار البيضاء','الرباط','مراكش','أكادير','فاس','طنجة','مكناس','وجدة'];
const names  = ['سارة','مريم','فاطمة','خديجة','أمينة','نور','إيمان','حنان','رجاء','سلمى'];
const SocialProofToast = () => {
  const [toast, setToast] = useState<{name:string;city:string;product:string;ago:number}|null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = () => {
      const p = productsData[Math.floor(Math.random()*productsData.length)];
      setToast({
        name: names[Math.floor(Math.random()*names.length)],
        city: cities[Math.floor(Math.random()*cities.length)],
        product: p.name.ar,
        ago: Math.floor(Math.random()*45)+2,
      });
      setVisible(true);
      setTimeout(()=>setVisible(false), 4000);
    };
    const t1 = setTimeout(show, 3000);
    const interval = setInterval(show, 18000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);
  return (
    <div className={`fixed bottom-20 left-3 z-50 transition-all duration-500 ${visible?'opacity-100 translate-y-0':'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="bg-white rounded-2xl shadow-2xl p-3 flex items-center gap-3 max-w-[280px] border border-green-100">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">✓</div>
        <div dir="rtl">
          <p className="text-xs font-black text-gray-900">{toast?.name} من {toast?.city}</p>
          <p className="text-[10px] text-gray-500">طلبت {toast?.product} منذ {toast?.ago} دقيقة</p>
        </div>
      </div>
    </div>
  );
};

// ─── COUNTDOWN TIMER ─────────────────────────────────────────────────────────
const CountdownBanner = ({ language }: { language: Language }) => {
  const [time, setTime] = useState({ h: 2, m: 47, s: 33 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--; if(s<0){s=59;m--;} if(m<0){m=59;h--;} if(h<0){h=2;m=47;s=33;}
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2,'0');
  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-2 px-4 text-center text-xs font-black">
      <span>{language==='ar'?'⚡ العرض ينتهي خلال':'⚡ Offre expire dans'} </span>
      <span className="bg-black/30 rounded px-1 mx-0.5 tabular-nums">{pad(time.h)}</span>:
      <span className="bg-black/30 rounded px-1 mx-0.5 tabular-nums">{pad(time.m)}</span>:
      <span className="bg-black/30 rounded px-1 mx-0.5 tabular-nums">{pad(time.s)}</span>
    </div>
  );
};

// ─── STICKY CTA BAR ──────────────────────────────────────────────────────────
const StickyBar = ({ language, onCta }: { language: Language; onCta: ()=>void }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${show?'translate-y-0':'translate-y-full'}`}>
      <div className="bg-white border-t-2 border-green-400 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1" dir={language==='ar'?'rtl':'ltr'}>
          <p className="text-xs text-gray-500 font-bold">{language==='ar'?'التوصيل مجاني 🚚':'Livraison gratuite 🚚'}</p>
          <p className="text-sm font-black text-gray-900">{language==='ar'?'ادفع عند الاستلام':'Paiement à la réception'}</p>
        </div>
        <button
          onClick={onCta}
          className="bg-green-500 active:bg-green-600 text-white font-black px-5 py-3 rounded-xl text-sm shadow-lg flex items-center gap-2 shrink-0"
        >
          <span>{language==='ar'?'اطلب الآن':'Commander'}</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </button>
      </div>
    </div>
  );
};

// ─── STOCK BAR ───────────────────────────────────────────────────────────────
const StockBar = ({ stock, language }: { stock: number; language: Language }) => {
  const pct = Math.min((stock / 10) * 100, 100);
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-[11px] font-black mb-1">
        <span className="text-red-500 animate-pulse">
          {language==='ar'?`⚠️ باقي ${stock} قطع فقط!`:`⚠️ Plus que ${stock} pièces!`}
        </span>
        <span className="text-gray-400">{language==='ar'?'الكمية':'Stock'}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─── PRODUCT CARD ────────────────────────────────────────────────────────────
const ProductCard = ({
  product, language, selectedColor, onColorSelect, onWhatsApp,
}: {
  product: Product;
  language: Language;
  selectedColor: string | null;
  onColorSelect: (name: string) => void;
  onWhatsApp: () => void;
}) => {
  const [imgIdx, setImgIdx] = useState(0);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const colorList = colors[language];
  const isRtl = language === 'ar';

  // ViewContent after 2s
  useEffect(() => {
    const t = setTimeout(() => {
      trackMetaEvent('ViewContent', { content_name: product.name[language], value: product.price, currency: 'MAD', content_ids: [`product_${product.id}`], content_type: 'product' });
      trackTTEvent('ViewContent', { content_type: 'product', content_id: `product_${product.id}`, content_name: product.name[language], value: product.price, currency: 'MAD' });
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col" dir={isRtl?'rtl':'ltr'}>
      {/* Badge */}
      <div className="relative">
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow">
          {product.badge[language]}
        </div>
        <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-black px-2 py-1 rounded-lg">
          -{discount}%
        </div>

        {/* Image 1:1 */}
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={product.name[language]}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i===imgIdx?'opacity-100':'opacity-0'}`}
              loading={i===0?'eager':'lazy'}
            />
          ))}
        </div>

        {/* Dot nav */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {product.images.map((_,i) => (
            <button
              key={i}
              onClick={()=>setImgIdx(i)}
              className={`rounded-full transition-all ${i===imgIdx?'w-5 h-2 bg-white':'w-2 h-2 bg-white/60'}`}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-gray-900 text-base mb-1 text-center">{product.name[language]}</h3>

        {/* Sold count */}
        <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 mb-3">
          <span className="text-yellow-500">★★★★★</span>
          <span className="font-bold">{product.soldCount.toLocaleString()} {language==='ar'?'طلب':'commandes'}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-3xl font-black text-gray-900">{product.price} <span className="text-lg">{language==='ar'?'درهم':'DH'}</span></span>
          <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
        </div>

        {/* Stock bar */}
        <StockBar stock={product.stock} language={language} />

        {/* Color picker */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 mb-2 text-center">
            {language==='ar'?'اختر اللون:':'Choisissez la couleur:'}
            {selectedColor && <span className="text-green-600 mr-1"> {selectedColor}</span>}
          </p>
          <div className="flex justify-center gap-2">
            {colorList.map((c) => (
              <button
                key={c.name}
                onClick={()=>onColorSelect(c.name)}
                className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor===c.name?'border-green-500 scale-110 shadow-lg':'border-gray-200 hover:border-gray-400'}`}
                style={{ background: c.hex, boxShadow: c.hex==='#f5f0eb'?'inset 0 0 0 1px #ddd':undefined }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onWhatsApp}
          className={`mt-auto w-full bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm ${!selectedColor?'opacity-80':''}`}
          style={{ animation: 'shakeCta 4s ease-in-out infinite' }}
        >
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span>{language==='ar'?'اطلب الآن عبر واتساب':'Commander sur WhatsApp'}</span>
        </button>

        {!selectedColor && (
          <p className="text-center text-[10px] text-red-400 font-bold mt-1">
            {language==='ar'?'← اختر اللون أولاً':'← Choisissez d\'abord la couleur'}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── TRUST BADGES ────────────────────────────────────────────────────────────
const TrustBadges = ({ language }: { language: Language }) => {
  const badges = language === 'ar'
    ? [
        { icon: '🚚', title: 'التوصيل مجاني', sub: 'الدفع عند الاستلام' },
        { icon: '⭐', title: 'جودة عالية', sub: 'خشب MDF 18mm' },
        { icon: '🛡️', title: 'ضمان الجودة', sub: '100٪ مضمون' },
        { icon: '⚡', title: 'توصيل سريع', sub: '2-4 أيام' },
      ]
    : [
        { icon: '🚚', title: 'Livraison gratuite', sub: 'Paiement à réception' },
        { icon: '⭐', title: 'Qualité premium', sub: 'Bois MDF 18mm' },
        { icon: '🛡️', title: 'Qualité garantie', sub: '100% garanti' },
        { icon: '⚡', title: 'Livraison rapide', sub: '2-4 jours' },
      ];
  return (
    <div className="bg-gray-900 py-4 px-3">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {badges.map((b,i) => (
          <div key={i} className="flex items-center gap-2" dir={language==='ar'?'rtl':'ltr'}>
            <span className="text-2xl">{b.icon}</span>
            <div>
              <p className="text-white text-xs font-black leading-tight">{b.title}</p>
              <p className="text-gray-400 text-[10px]">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────
function App() {
  const [language, setLanguage]             = useState<Language>('ar');
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>({});
  const [firstProductRef]                   = useState(() => React.createRef<HTMLDivElement>());
  const isRtl = language === 'ar';

  const handleWhatsApp = useCallback((product: Product) => {
    const color   = selectedColors[product.id] || '';
    const tracking = getTrackingPayload();
    const refId   = (Date.now().toString(36).slice(-3) + Math.random().toString(36).slice(2,5)).toUpperCase();
    const orderId = `ORDER_${Date.now()}`;
    const num     = whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)];

    // InitiateCheckout browser pixel
    trackMetaEvent('InitiateCheckout', {
      content_name: product.name[language],
      content_ids:  [`product_${product.id}`],
      content_type: 'product',
      currency:     'MAD',
      value:        product.price,
      event_id:     orderId,
    });
    trackTTEvent('InitiateCheckout', {
      content_type: 'product',
      content_id:   `product_${product.id}`,
      content_name: product.name[language],
      value:        product.price,
      currency:     'MAD',
    });

    // Backend log
    fetch(BACKEND_ENDPOINT, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'log_click', refId, orderId,
        productName: product.name[language],
        price: product.price, color,
        ...tracking,
        currentUrl: window.location.href,
        timestamp: Date.now(),
      }),
    }).catch(() => {});

    // WhatsApp message
    const msg = language === 'ar'
      ? `السلام عليكم 👋\nأنا مهتم بـ: *${product.name.ar}*\nاللون: *${color || 'لم يُحدد'}*\nالسعر: *${product.price} درهم*\n\n🔖 كود الطلب: #${refId}`
      : `Bonjour 👋\nJe suis intéressé par: *${product.name.fr}*\nCouleur: *${color || 'Non choisi'}*\nPrix: *${product.price} DH*\n\n🔖 Réf: #${refId}`;

    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  }, [selectedColors, language]);

  const scrollToProducts = () => {
    firstProductRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRtl?'rtl':'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: ${isRtl?"'Cairo','Tajawal',sans-serif":"system-ui,sans-serif"}; }
        @keyframes shakeCta {
          0%,45%,55%,100% { transform: translateX(0); }
          47% { transform: translateX(-6px); }
          49% { transform: translateX(6px); }
          51% { transform: translateX(-4px); }
          53% { transform: translateX(4px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse-ring::before {
          content:'';
          position:absolute;
          inset:0;
          border-radius:9999px;
          background:rgba(34,197,94,0.4);
          animation: pulse-ring 1.5s ease-out infinite;
        }
      `}</style>

      <PixelInit />
      <noscript><img height="1" width="1" style={{display:'none'}} src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} alt="" /></noscript>

      {/* Countdown */}
      <CountdownBanner language={language} />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/others/wjGs4dLMgdmpRz5mH5cuoQtNQSI9ii22LWfVkDuA.png"
            alt="DECOREL" className="h-9 w-auto"
          />
          <button
            onClick={()=>setLanguage(l=>l==='ar'?'fr':'ar')}
            className="text-xs font-black bg-gray-900 text-white px-3 py-2 rounded-xl flex items-center gap-1"
          >
            {language==='ar'?<>FR 🇫🇷</>:<>AR 🇲🇦</>}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 text-center">
        <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">
          {language==='ar'?'🔥 عرض حصري محدود':'🔥 Offre exclusive limitée'}
        </p>
        <h1 className="text-white font-black text-2xl md:text-4xl leading-tight mb-3">
          {language==='ar'
            ? <>كوافوزات فاخرة بخشب MDF<br/><span className="text-yellow-400">التوصيل مجاني + الدفع عند الاستلام</span></>
            : <>Coiffeuses premium MDF<br/><span className="text-yellow-400">Livraison gratuite + Paiement réception</span></>
          }
        </h1>
        <div className="flex justify-center gap-4 text-xs text-gray-300 mb-6">
          <span>✅ {language==='ar'?'+1200 طلب':'1200+ commandes'}</span>
          <span>✅ {language==='ar'?'تسليم 2-4 أيام':'Livraison 2-4j'}</span>
          <span>✅ {language==='ar'?'جودة مضمونة':'Qualité garantie'}</span>
        </div>
        <button
          onClick={scrollToProducts}
          className="relative inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black px-8 py-4 rounded-2xl shadow-2xl text-base transition-all active:scale-95 pulse-ring"
        >
          <span>{language==='ar'?'اختر موديلك الآن ⬇':'Choisir mon modèle ⬇'}</span>
        </button>
      </section>

      {/* Trust */}
      <TrustBadges language={language} />

      {/* Products grid */}
      <main className="max-w-6xl mx-auto px-3 py-6 pb-24" ref={firstProductRef}>
        <h2 className="text-center font-black text-gray-900 text-lg mb-1">
          {language==='ar'?'🛋️ اختر موديلك المفضل':'🛋️ Choisissez votre modèle'}
        </h2>
        <p className="text-center text-xs text-gray-500 mb-5">
          {language==='ar'?'الأسعار شاملة التوصيل — الدفع عند استلام الطلب':'Prix livraison incluse — Paiement à la réception'}
        </p>

        {/* Mobile: 1 col / Desktop: 4 col (but we have 3 products — so md:grid-cols-3 for 3 items) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {productsData.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              language={language}
              selectedColor={selectedColors[product.id] ?? null}
              onColorSelect={(name) => setSelectedColors(prev => ({ ...prev, [product.id]: name }))}
              onWhatsApp={() => handleWhatsApp(product)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-center shadow-xl">
          <p className="text-white font-black text-base mb-1">
            {language==='ar'?'🚚 توصيل مجاني لجميع المدن المغربية':'🚚 Livraison gratuite partout au Maroc'}
          </p>
          <p className="text-green-100 text-xs">
            {language==='ar'?'الدفع عند الاستلام — بدون بطاقة بنكية — بدون تسجيل':'Paiement à la livraison — Sans carte — Sans inscription'}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs pb-20">
        <p className="font-bold text-white mb-1">DECOREL</p>
        <p>{language==='ar'?'أكادير، المغرب — صناعة مغربية 100٪':'Agadir, Maroc — Fabrication 100% marocaine'}</p>
        <div className="flex justify-center gap-4 mt-3">
          <a href="https://decorel.shop/pages/confidentiality" className="hover:text-white transition-colors">
            {language==='ar'?'الخصوصية':'Confidentialité'}
          </a>
          <span>·</span>
          <a href="https://decorel.shop/pages/shipping-delivery" className="hover:text-white transition-colors">
            {language==='ar'?'التوصيل':'Livraison'}
          </a>
        </div>
        <p className="mt-2">© 2026 DECOREL</p>
      </footer>

      {/* Overlays */}
      <SocialProofToast />
      <StickyBar language={language} onCta={scrollToProducts} />
    </div>
  );
}

export default App;