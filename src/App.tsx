import React, { useState, useEffect } from 'react';
import { 
  Mountain, Menu, History, Users, BellOff, Coffee, 
  HeartHandshake, ArrowRight, Wifi, Sun, Utensils, 
  Star, MapPin, Mail, MessageCircle, CreditCard,
  Instagram, X, Check, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import roomsData from './data/rooms.json';
import contentData from './data/content.json';

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

function RoomCard({ room, onBook }: { key?: string | number, room: any, onBook: () => void }) {
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
      <div className="sm:w-2/5 h-64 sm:h-auto shrink-0 relative overflow-hidden">
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
              <h2 className="mb-2 text-3xl font-bold text-slate-900">Book Your Stay</h2>
              <p className="mb-8 text-slate-600">Select your preferred booking platform or contact us directly.</p>
              
              <div className="grid gap-6 md:grid-cols-2">
                <a href={contentData.booking.bookingDotCom} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 p-6 text-center transition-all hover:border-primary hover:bg-primary/5">
                  <div className="mb-4 rounded-full bg-blue-100 p-4 text-blue-600">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="mb-1 font-bold text-slate-900">Booking.com</h3>
                  <p className="text-sm text-slate-500">Instant confirmation</p>
                </a>
                
                <a href={contentData.booking.agoda} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 p-6 text-center transition-all hover:border-primary hover:bg-primary/5">
                  <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="mb-1 font-bold text-slate-900">Agoda</h3>
                  <p className="text-sm text-slate-500">Best price guarantee</p>
                </a>
              </div>
              
              <div className="mt-8 rounded-xl bg-slate-50 p-6">
                <h4 className="mb-4 font-bold text-slate-900 font-sans">Good to know</h4>
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
              <h2 className="mb-2 text-3xl font-bold text-slate-900">Contact Us</h2>
              <p className="mb-8 text-slate-600">We'd love to hear from you. Reach out with any questions.</p>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-sans">Address</h4>
                      <p className="text-slate-600">{contentData.contact.address.street}<br/>{contentData.contact.address.city}<br/>{contentData.contact.address.country}</p>
                      <a href={contentData.contact.address.mapLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">View on Google Maps</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-sans">WhatsApp / Phone</h4>
                      <p className="text-slate-600">{contentData.contact.phone}</p>
                      <a href={contentData.contact.whatsappLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">Message on WhatsApp</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-sans">Email</h4>
                      <p className="text-slate-600">{contentData.contact.email}</p>
                      <a href={`mailto:${contentData.contact.email}`} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">Send an email</a>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl bg-slate-50 p-6">
                  <h4 className="mb-4 font-bold text-slate-900 font-sans">Directions</h4>
                  <p className="mb-4 text-sm text-slate-600">
                    <strong>From Lienz:</strong> {contentData.directions.fromLienz}
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Winter driving:</strong> {contentData.directions.winterDriving}
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

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <Mountain className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">{contentData.site.name}</h2>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('rooms')} className="text-sm font-medium hover:text-primary transition-colors">Rooms</button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-primary transition-colors">About</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-primary transition-colors">Experience</button>
              <button onClick={() => setIsContactOpen(true)} className="text-sm font-medium hover:text-primary transition-colors">Contact</button>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20"
              >
                Book Now
              </button>
            </nav>
            
            <div className="md:hidden">
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
                <button onClick={() => scrollToSection('rooms')} className="text-left text-lg font-medium hover:text-primary">Rooms</button>
                <button onClick={() => scrollToSection('about')} className="text-left text-lg font-medium hover:text-primary">About</button>
                <button onClick={() => scrollToSection('features')} className="text-left text-lg font-medium hover:text-primary">Experience</button>
                <button onClick={() => setIsContactOpen(true)} className="text-left text-lg font-medium hover:text-primary">Contact</button>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold text-center transition-all shadow-lg shadow-primary/20 mt-4"
                >
                  Book Now
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
              src={contentData.hero.image}
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
                src={contentData.about.images[0]}
              />
              <img 
                alt="Sheep" 
                className="rounded-2xl h-64 w-full object-cover shadow-lg mt-8" 
                src={contentData.about.images[1]}
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
              <RoomCard key={room.id} room={room} onBook={() => setIsBookingOpen(true)} />
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-24 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="text-6xl font-black mb-2 font-sans">{contentData.reviews.score}</div>
                <div className="flex justify-center lg:justify-start gap-1 mb-4">
                  <Star className="fill-white text-white h-6 w-6" />
                  <Star className="fill-white text-white h-6 w-6" />
                  <Star className="fill-white text-white h-6 w-6" />
                  <Star className="fill-white text-white h-6 w-6" />
                  <Star className="fill-white text-white h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{contentData.reviews.title}</h2>
                <p className="text-white/80 font-sans">{contentData.reviews.subtitle}</p>
              </div>
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                {contentData.reviews.items.map((review, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                    <p className="italic mb-6 text-lg">"{review.quote}"</p>
                    <div className="font-bold font-sans">— {review.author}</div>
                  </div>
                ))}
              </div>
            </div>
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
              <h3 className="text-white font-bold mb-6 font-sans">Contact Us</h3>
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
              <h3 className="text-white font-bold mb-6 font-sans">Quick Links</h3>
              <ul className="space-y-4 font-sans">
                <li><button onClick={() => setIsBookingOpen(true)} className="hover:text-primary transition-colors">Book Your Stay</button></li>
                <li>
                  <a href={contentData.contact.whatsappLink} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                    <MessageCircle className="text-primary h-5 w-5" /> 
                    WhatsApp Us
                  </a>
                </li>
                <li><button onClick={() => setIsContactOpen(true)} className="hover:text-primary transition-colors">Directions & Info</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4 font-sans">
            <p>© {new Date().getFullYear()} Unterhecherhof. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <CreditCard className="text-primary h-5 w-5" />
              <span>Secure Booking System</span>
            </div>
          </div>
        </div>
      </footer>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
