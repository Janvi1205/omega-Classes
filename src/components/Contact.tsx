import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import MapboxMap from './MapboxMap';
const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  const contactInfo = [{
    icon: Phone,
    title: 'Phone',
    details: '+91 7070960095 ,+91 6206609241',
    subtitle: 'Call us anytime'
  }, {
    icon: Mail,
    title: 'Email',
    details: 'omegaproclasses@gmail.com',
    subtitle: 'We reply within 24 hours'
  }, {
    icon: MapPin,
    title: 'Address',
    details: 'Flat No. 102, Lalti Apartment, Kali Mandir Road, Hanuman Nagar, Kankarbagh, Patna - 800020',
    subtitle: 'Visit our campus'
  }];
  return <section id="contact" className="py-20 bg-secondary/30" ref={ref}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{
        opacity: 0,
        y: 50
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.8
      }} className="text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Get In Touch
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about our courses? We're here to help you choose the right path for your academic success.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact Information */}
        <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={isInView ? {
          opacity: 1,
          x: 0
        } : {}} transition={{
          duration: 0.8,
          delay: 0.2
        }}>
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Contact Information
          </h3>

          <div className="space-y-6">
            {contactInfo.map((item, index) => <motion.div key={item.title} initial={{
              opacity: 0,
              y: 20
            }} animate={isInView ? {
              opacity: 1,
              y: 0
            } : {}} transition={{
              duration: 0.6,
              delay: 0.3 + index * 0.1
            }} className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors group">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  {item.title}
                </h4>
                <p className="text-foreground font-medium mb-1">
                  {item.details}

                </p>
                <p className="text-muted-foreground text-sm">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>)}
          </div>

          {/* Quick Actions */}
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={isInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.8,
            delay: 0.8
          }} className="mt-8 space-y-4">
            <h4 className="font-semibold text-foreground mb-4">
              Quick Contact
            </h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/917070960095">
                <motion.button whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="btn-primary flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  WhatsApp Us
                </motion.button>
              </a>
              <a href='tel:+917070960095' className="flex-1">
                <motion.button whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="btn-secondary flex items-center justify-center gap-2">
                  <Phone size={20} />
                  Call Now
                </motion.button>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Google Map */}
        <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={isInView ? {
          opacity: 1,
          x: 0
        } : {}} transition={{
          duration: 0.8,
          delay: 0.4
        }} className="relative">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Our Location
          </h3>

          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            {/* Google Map iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.4413787789736!2d85.16647069999999!3d25.5902456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed590061601ec5%3A0x33732da89cfbb956!2sLalti%20apartment!5e0!3m2!1sen!2sin!4v1754737347635!5m2!1sen!2sin"
              className="w-full h-60 sm:h-80"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Map overlay with contact button */}
            <div className="absolute bottom-4 left-4 right-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Omega Pro Classes
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Flat No. 102, Lalti Apartment, Kali Mandir Road, Hanuman Nagar, Kankarbagh, Patna - 800020
                    </p>
                  </div>
                  <motion.a
                    href="https://maps.google.com/?q=Flat No. 102, Lalti Apartment, Kali Mandir Road, Hanuman Nagar, Kankarbagh, Patna - 800020"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-primary text-primary-foreground p-2 rounded-lg"
                  >
                    <MapPin size={20} />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>


          {/* Additional Info */}

        </motion.div>
      </div>
    </div>
  </section>;
};
export default Contact;