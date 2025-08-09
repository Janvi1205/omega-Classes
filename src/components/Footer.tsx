import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerLinks = {
    courses: [{
      name: 'Nurture Batch (7-10)',
      href: '#batches'
    }, {
      name: 'Foundation Batch (11-12)',
      href: '#batches'
    }, {
      name: 'JEE Preparation',
      href: '#batches'
    }, {
      name: 'NEET Preparation',
      href: '#batches'
    }],
    quickLinks: [{
      name: 'Home',
      href: '/'
    }, {
      name: 'About Us',
      href: '#'
    }, {
      name: 'Contact',
      href: '#contact'
    }, {
      name: 'Study Material',
      href: '/study-material'
    }],
    support: [{
      name: 'FAQ',
      href: '#'
    }, {
      name: 'Student Portal',
      href: '#'
    }, {
      name: 'Downloads',
      href: '/study-material'
    }, {
      name: 'Privacy Policy',
      href: '#'
    }]
  };
  const socialLinks = [{
    name: 'Facebook',
    icon: Facebook,
    href: '#'
  }, {
    name: 'Twitter',
    icon: Twitter,
    href: '#'
  }, {
    name: 'Instagram',
    icon: Instagram,
    href: '#'
  }, {
    name: 'YouTube',
    icon: Youtube,
    href: '#'
  }];
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            <h3 className="text-2xl font-bold mb-4">Omega Pro Classes</h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Empowering students with quality education and expert guidance. 
              Join us for a transformative learning experience.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span className="text-sm">+91 7070960095</span>
                <br />
                <span className="text-sm">+91 6206609241</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span className="text-sm">omegaproclasses@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-sm">Flat No. 102, Lalti Apartment, Kali Mandir Road, Hanuman Nagar, Kankarbagh, Patna - 800020</span>
              </div>
            </div>
          </motion.div>

          {/* Courses */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} viewport={{
          once: true
        }}>
            <h4 className="text-lg font-semibold mb-4">Our Courses</h4>
            <ul className="space-y-2">
              {footerLinks.courses.map(link => <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                    {link.name}
                  </a>
                </li>)}
            </ul>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} viewport={{
        once: true
      }} className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © {currentYear} Omega Pro Classes. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              
              
              <motion.button onClick={scrollToTop} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-4 py-2 rounded-lg transition-colors text-sm">
                Back to Top
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>;
};
export default Footer;