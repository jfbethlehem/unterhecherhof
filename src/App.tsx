import React, { useState, useEffect } from 'react';
import { 
  Mountain, Menu, History, Users, BellOff, Coffee, 
  HeartHandshake, ArrowRight, Wifi, Sun, Utensils, 
  Star, MapPin, Mail, MessageCircle, CreditCard,
  Instagram, X, Check, Calendar, ChevronLeft, ChevronRight,
  Globe, ChevronDown, Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import roomsDataEn from './data/rooms.en.json';
import contentDataEn from './data/content.en.json';
import roomsDataDe from './data/rooms.de.json';
import contentDataDe from './data/content.de.json';
import roomsDataFr from './data/rooms.fr.json';
import contentDataFr from './data/content.fr.json';
import roomsDataIt from './data/rooms.it.json';
import contentDataIt from './data/content.it.json';
import roomsDataTl from './data/rooms.tl.json';
import contentDataTl from './data/content.tl.json';
import roomsDataNl from './data/rooms.nl.json';
import contentDataNl from './data/content.nl.json';
const galleryPaths = Object.keys(import.meta.glob('/public/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}')).map(p => p.replace('/public', ''));
const doubleroomPaths = Object.keys(import.meta.glob('/public/doubleroom/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}')).map(p => p.replace('/public', ''));
const apartmentPaths = Object.keys(import.meta.glob('/public/apartment/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}')).map(p => p.replace('/public', ''));

const imagesData = {
  hero: "/images/hero.jpg",
  about: [
    "/images/about-1.jpg",
    "/images/about-2.jpg"
  ],
  gallery: galleryPaths,
  rooms: {
    "deluxe-double": doubleroomPaths,
    "3-bedroom-apartment": apartmentPaths
  }
};

const contentDataMap = {
  en: contentDataEn,
  de: contentDataDe,
  fr: contentDataFr,
  it: contentDataIt,
  tl: contentDataTl,
  nl: contentDataNl
};

const roomsDataMap = {
  en: roomsDataEn,
  de: roomsDataDe,
  fr: roomsDataFr,
  it: roomsDataIt,
  tl: roomsDataTl,
  nl: roomsDataNl
};

type Language = 'en' | 'de' | 'fr' | 'it' | 'tl' | 'nl';

const languageNames: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  tl: 'Filipino',
  nl: 'Nederlands'
};

const LanguageContext = React.createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  contentData: typeof contentDataEn;
  roomsData: typeof roomsDataEn;
}>({
  language: 'en',
  setLanguage: () => {},
  contentData: contentDataEn,
  roomsData: roomsDataEn,
});

export function useLanguage() {
  return React.useContext(LanguageContext);
}

const iconMap: Record<string, React.ElementType> = {
  Wifi,
  Sun,
  Users,
  Utensils,
  Mountain,
  History,
  BellOff,
  Coffee,
  HeartHandshake,
  Star,
  MapPin,
  Mail,
  MessageCircle,
  Instagram,
  Check,
  Calendar
};

export type ImageGroup = {
  images: string[];
  initialIndex: number;
};

function ImageModal({ imageGroup, onClose }: { imageGroup: ImageGroup | null; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageGroup) {
      setCurrentIndex(imageGroup.initialIndex);
    }
  }, [imageGroup]);

  if (!imageGroup || !imageGroup.images || imageGroup.images.length === 0) return null;

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageGroup.images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageGroup.images.length) % imageGroup.images.length);
  };

  return (
    <AnimatePresence>
      {imageGroup && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-zoom-out"
        >
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors z-[201]">
            <X className="h-6 w-6" />
          </button>
          
          {imageGroup.images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all z-[201]">
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all z-[201]">
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={imageGroup.images[currentIndex]}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GallerySlideshow({ images, onImageClick }: { images: string[], onImageClick: (group: ImageGroup) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden group shadow-xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
          onClick={() => onImageClick({ images, initialIndex: currentIndex })}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button 
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
}

function RoomCard({ room, onBook, onImageClick }: { key?: string | number, room: any, onBook: () => void, onImageClick: (group: ImageGroup) => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!room.images || room.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % room.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [room.images]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-primary/10 flex flex-col sm:flex-row h-full">
      <div 
        className="sm:w-2/5 h-64 sm:h-auto shrink-0 relative overflow-hidden cursor-zoom-in"
        onClick={() => onImageClick({ images: room.images, initialIndex: currentImageIndex })}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            alt={room.name} 
            className="w-full h-full object-cover absolute inset-0" 
            src={room.images[currentImageIndex]}
          />
        </AnimatePresence>
      </div>
      <div className="p-8 sm:w-3/5 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
          <p className="text-slate-500 text-sm mb-4 font-sans">{room.description}</p>
          <ul className="text-sm space-y-2 mb-6 font-sans">
            {room.amenities.map((amenity: any, index: number) => {
              const IconComponent = iconMap[amenity.icon] || Check;
              return (
                <li key={index} className="flex items-center gap-2">
                  <IconComponent className="text-primary h-5 w-5" /> {amenity.text}
                </li>
              );
            })}
          </ul>
        </div>
        <button onClick={onBook} className="w-full py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors font-sans mt-auto">
          {room.buttonText}
        </button>
      </div>
    </div>
  );
}

function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { contentData } = useLanguage();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-8">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">{contentData.ui.bookingModal.title}</h2>
              <p className="mb-8 text-slate-600">{contentData.ui.bookingModal.subtitle}</p>
              
              <div className="grid gap-6 md:grid-cols-2">
                <a href={contentData.booking.bookingDotCom} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 p-6 text-center transition-all hover:border-primary hover:bg-primary/5">
                  <div className="mb-4 rounded-full bg-blue-100 p-4 text-blue-600">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="mb-1 font-bold text-slate-900">Booking.com</h3>
                  <p className="text-sm text-slate-500">{contentData.ui.bookingModal.instantConfirmation}</p>
                </a>
                
                <a href={contentData.booking.agoda} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 p-6 text-center transition-all hover:border-primary hover:bg-primary/5">
                  <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="mb-1 font-bold text-slate-900">Agoda</h3>
                  <p className="text-sm text-slate-500">{contentData.ui.bookingModal.bestPrice}</p>
                </a>
              </div>
              
              <div className="mt-8 rounded-xl bg-slate-50 p-6">
                <h4 className="mb-4 font-bold text-slate-900 font-sans">{contentData.ui.bookingModal.goodToKnow}</h4>
                <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  {contentData.booking.goodToKnow.map((item, index) => (
                    <li key={index} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { contentData } = useLanguage();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-8">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">{contentData.ui.contactModal.title}</h2>
              <p className="mb-8 text-slate-600">{contentData.ui.contactModal.subtitle}</p>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-sans">{contentData.ui.contactModal.address}</h4>
                      <p className="text-slate-600">{contentData.contact.address.street}<br/>{contentData.contact.address.city}<br/>{contentData.contact.address.country}</p>
                      <a href={contentData.contact.address.mapLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">{contentData.ui.contactModal.viewMap}</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-sans">{contentData.ui.contactModal.phone}</h4>
                      <p className="text-slate-600">{contentData.contact.phone}</p>
                      <a href={contentData.contact.whatsappLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">{contentData.ui.contactModal.messageWhatsapp}</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-sans">{contentData.ui.contactModal.email}</h4>
                      <p className="text-slate-600">{contentData.contact.email}</p>
                      <a href={`mailto:${contentData.contact.email}`} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">{contentData.ui.contactModal.sendEmail}</a>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl bg-slate-50 p-6">
                  <h4 className="mb-4 font-bold text-slate-900 font-sans">{contentData.ui.contactModal.directions}</h4>
                  <p className="mb-4 text-sm text-slate-600">
                    <strong>{contentData.ui.contactModal.fromLienz}</strong> {contentData.directions.fromLienz}
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>{contentData.ui.contactModal.winterDriving}</strong> {contentData.directions.winterDriving}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LanguageSelector({ language, setLanguage }: { language: Language, setLanguage: (lang: Language) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{language}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20"
            >
              {(Object.keys(languageNames) as Language[])
                .sort((a, b) => languageNames[a].localeCompare(languageNames[b]))
                .map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang ? 'text-primary font-bold bg-primary/5' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {languageNames[lang]}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MainApp() {
  const { contentData, roomsData, language, setLanguage } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImageGroup, setSelectedImageGroup] = useState<ImageGroup | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      <ImageModal imageGroup={selectedImageGroup} onClose={() => setSelectedImageGroup(null)} />
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <Mountain className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">{contentData.site.name}</h2>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('rooms')} className="text-sm font-medium hover:text-primary transition-colors">{contentData.ui.nav.rooms}</button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-primary transition-colors">{contentData.ui.nav.about}</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-primary transition-colors">{contentData.ui.nav.experience}</button>
              <button onClick={() => setIsContactOpen(true)} className="text-sm font-medium hover:text-primary transition-colors">{contentData.ui.nav.contact}</button>
              
              <div className="flex items-center gap-2 border-l border-slate-200 pl-6 ml-2">
                <LanguageSelector language={language} setLanguage={setLanguage} />
              </div>

              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20"
              >
                {contentData.ui.nav.bookNow}
              </button>
            </nav>
            
            <div className="md:hidden flex items-center gap-4">
              <div className="flex items-center mr-2">
                <LanguageSelector language={language} setLanguage={setLanguage} />
              </div>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-b border-slate-100"
            >
              <div className="flex flex-col px-4 py-6 space-y-4">
                <button onClick={() => scrollToSection('rooms')} className="text-left text-lg font-medium hover:text-primary">{contentData.ui.nav.rooms}</button>
                <button onClick={() => scrollToSection('about')} className="text-left text-lg font-medium hover:text-primary">{contentData.ui.nav.about}</button>
                <button onClick={() => scrollToSection('features')} className="text-left text-lg font-medium hover:text-primary">{contentData.ui.nav.experience}</button>
                <button onClick={() => setIsContactOpen(true)} className="text-left text-lg font-medium hover:text-primary">{contentData.ui.nav.contact}</button>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold text-center transition-all shadow-lg shadow-primary/20 mt-4"
                >
                  {contentData.ui.nav.bookNow}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              alt="Hero background" 
              className="w-full h-full object-cover" 
              src={imagesData.hero}
            />
          </div>
          <div className="relative z-20 text-center px-4 max-w-4xl">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6"
            >
              {contentData.hero.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/90 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto font-sans"
            >
              {contentData.hero.subtitle}
            </motion.p>
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={() => setIsBookingOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary/30"
            >
              {contentData.hero.buttonText}
            </motion.button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm font-sans">
                <span className="h-px w-8 bg-primary"></span>
                {contentData.about.tagline}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">{contentData.about.title}</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-sans">
                {contentData.about.description}
              </p>
              <div className="flex gap-4 pt-4">
                {contentData.about.highlights.map((highlight, index) => {
                  const IconComponent = iconMap[highlight.icon] || Check;
                  return (
                    <div key={index} className="bg-primary/10 p-4 rounded-lg flex-1">
                      <IconComponent className="text-primary h-8 w-8" />
                      <p className="font-bold mt-2 font-sans">{highlight.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                alt="Exterior" 
                className="rounded-2xl h-64 w-full object-cover shadow-lg" 
                src={imagesData.about[0]}
              />
              <img 
                alt="Sheep" 
                className="rounded-2xl h-64 w-full object-cover shadow-lg mt-8" 
                src={imagesData.about[1]}
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="bg-primary/5 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{contentData.features.title}</h2>
              <p className="text-slate-600 font-sans">{contentData.features.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contentData.features.items.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Check;
                return (
                  <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-primary/5 hover:border-primary/20 transition-all group">
                    <IconComponent className="text-primary h-10 w-10 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-sans">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Rooms Preview */}
        <section id="rooms" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{contentData.roomsSection.title}</h2>
              <p className="text-slate-600 font-sans">{contentData.roomsSection.subtitle}</p>
            </div>
            <button onClick={() => setIsBookingOpen(true)} className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all font-sans">
              {contentData.roomsSection.buttonText} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {roomsData.map((room) => (
              <RoomCard key={room.id} room={{...room, images: imagesData.rooms[room.id as keyof typeof imagesData.rooms]}} onBook={() => setIsBookingOpen(true)} onImageClick={setSelectedImageGroup} />
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-24 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{contentData.ui.map.title}</h2>
              <p className="text-white/80 font-sans">{contentData.ui.map.subtitle}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 overflow-hidden shadow-xl min-h-[400px] flex items-center justify-center relative">
              <iframe 
                src="https://www.google.com/maps?q=Unterhecherhof,+Assling,+Austria&output=embed" 
                width="100%" 
                height="400" 
                frameBorder="0" 
                scrolling="yes"
                title="Google Maps - Unterhecherhof"
                className="absolute inset-0 w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups"
              >
                <p>Your browser does not support iframes.</p>
              </iframe>
            </div>

            <div className="mt-12 rounded-2xl bg-white/10 p-8 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Car className="text-white h-8 w-8" />
                <h3 className="font-bold text-2xl text-white font-sans">{contentData.ui.contactModal.directions}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-white mb-2">{contentData.ui.contactModal.fromLienz}</h4>
                  <p className="text-white/80">{contentData.directions.fromLienz}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">{contentData.ui.contactModal.winterDriving}</h4>
                  <p className="text-white/80">{contentData.directions.winterDriving}</p>
                </div>
              </div>
            </div>

            {imagesData.gallery && imagesData.gallery.length > 0 && (
              <div className="mt-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">{contentData.gallery.title}</h2>
                  <p className="text-white/80 font-sans">{contentData.gallery.subtitle}</p>
                </div>
                <GallerySlideshow images={imagesData.gallery} onImageClick={setSelectedImageGroup} />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-white mb-6">
                <Mountain className="text-primary h-8 w-8" />
                <h2 className="text-xl font-bold tracking-tight font-sans">{contentData.site.name}</h2>
              </div>
              <p className="max-w-md mb-8 font-sans">
                {contentData.site.description}
              </p>
              <div className="flex gap-4">
                <a href={contentData.contact.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6 font-sans">{contentData.ui.footer.contact}</h3>
              <ul className="space-y-4 font-sans">
                <li className="flex items-start gap-3">
                  <MapPin className="text-primary h-5 w-5 shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{contentData.contact.address.footerAddress}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-primary h-5 w-5 shrink-0" />
                  <a href={`mailto:${contentData.contact.email}`} className="hover:text-primary transition-colors">{contentData.contact.email}</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6 font-sans">{contentData.ui.footer.quickLinks}</h3>
              <ul className="space-y-4 font-sans">
                <li><button onClick={() => setIsBookingOpen(true)} className="hover:text-primary transition-colors">{contentData.ui.footer.bookStay}</button></li>
                <li>
                  <a href={contentData.contact.whatsappLink} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                    <MessageCircle className="text-primary h-5 w-5" /> 
                    {contentData.ui.footer.whatsappUs}
                  </a>
                </li>
                <li><button onClick={() => setIsContactOpen(true)} className="hover:text-primary transition-colors">{contentData.ui.footer.directionsInfo}</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4 font-sans">
            <p>© {new Date().getFullYear()} {contentData.site.name}. {contentData.ui.footer.allRightsReserved}</p>
            <div className="flex items-center gap-4">
              <CreditCard className="text-primary h-5 w-5" />
              <span>{contentData.ui.footer.secureBooking}</span>
            </div>
          </div>
        </div>
      </footer>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      contentData: contentDataMap[language],
      roomsData: roomsDataMap[language]
    }}>
      <MainApp />
    </LanguageContext.Provider>
  );
}
