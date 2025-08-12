import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { useNotifications } from '@/contexts/NotificationContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '#batches' },
    { name: 'Contact', path: '#contact' },
    { name: 'Study Material', path: '/study-material' },
  ];

  // Handle scrolling to section after navigation
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/${sectionId}`);
      return;
    }
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background navbar-shadow"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <img 
                src="/lovable-uploads/015a5adc-4651-42f3-b1d0-de3d52e59fe2.png" 
                alt="Omega Pro Classes" 
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                <span className="hidden sm:inline">Omega Pro Classes</span>
                <span className="sm:hidden">Omega Pro</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.path.startsWith('#') ? (
                    <button
                      onClick={() => scrollToSection(item.path)}
                      className="nav-link"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link 
                      to={item.path} 
                      className="nav-link"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
               <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationOpen(true)}
                className="text-primary hover:text-accent transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu button and notification */}
          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotificationOpen(true)}
              className="text-primary hover:text-accent transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </motion.button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.path.startsWith('#') ? (
                    <button
                      onClick={() => {
                        scrollToSection(item.path);
                        setIsOpen(false);
                      }}
                      className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => {
                        setIsOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </motion.nav>
  );
};

export default Navbar;