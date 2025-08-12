import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, ExternalLink } from 'lucide-react';

const YouTube = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const videos = [
    {
      id: '4',
      title: 'Some Natural Phenomena',
      thumbnail: 'https://img.youtube.com/vi/ZNcyyDYPX3s/maxresdefault.jpg',
      embedId: 'ZNcyyDYPX3s',
      description: 'By Rohan Sir'
    },

    {
      id: '1',
      title: 'Life Process- Class 10th',
      thumbnail: 'https://img.youtube.com/vi/i6zTmrUeRas/maxresdefault.jpg',
      embedId: 'i6zTmrUeRas',
      description: 'By A.M. Jha Sir'
    },


    {
      id: '2',
      title: 'Electronic Configuratoin- Class 11th',
      thumbnail: 'https://img.youtube.com/vi/mzKkWSn2UpU/maxresdefault.jpg',
      embedId: 'Z4Nl97ibTvs',
      description: 'By A.M Jha Sir'
    },



    {
      id: '3',
      title: 'Scaler Vector Tensor- Class 11th',
      thumbnail: 'https://img.youtube.com/vi/BNLr7shM9Dg/maxresdefault.jpg',
      embedId: 'J8z_euwH_Lw',
      description: 'By Chandra Shekhar Sir'
    },

  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden" ref={ref}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="floating-circle w-32 h-32 top-1/4 left-1/4 animate-float" style={{ animationDelay: '1s' }} />
        <div className="floating-square w-20 h-20 bottom-1/3 right-1/4 animate-float-slow" style={{ animationDelay: '3s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Educational Videos
          </h2>
          <p className="text-xl text-gray-900 dark:text-blue-200 max-w-3xl mx-auto">
            Watch our expert teachers explain complex concepts in simple, easy-to-understand ways
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="card-gradient rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] border border-white/10 hover:border-primary/30">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />

                  {/* Enhanced overlay with animations */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-4 animate-pulse-glow"
                    >
                      <Play className="text-white" size={32} />
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.embedId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      Watch Now
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-900 dark:text-blue-200 mb-6">
            Want to access more educational content and live classes?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://youtube.com/@omegaproclasses?si=lFpCZHz2x9VBtJp9"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2 flex-col p-5 relative overflow-hidden group/cta"
            >
              <span className="text-center relative z-10">
                Subscribe our channel
                <br />
                for class 7th to 10th
              </span>
              <ExternalLink size={16} className="relative z-10 group-hover/cta:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
              
            </motion.a>
            <motion.a
              href="https://youtube.com/@omegaproclasses1112?si=G-tY5W8cZkLNCC7f"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2 flex-col p-5 relative overflow-hidden group/cta2"
            >
              <span className="text-center relative z-10">
                Subscribe our channel
                <br />
                for class 11 and 12
              </span>
              <ExternalLink size={16} className="relative z-10 group-hover/cta2:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cta2:translate-x-full transition-transform duration-700" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTube;