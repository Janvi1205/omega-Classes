import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, ExternalLink } from 'lucide-react';

const YouTube = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const videos = [
    {
      id: '1',
      title: 'Educational Content - Physics',
      thumbnail: 'https://img.youtube.com/vi/i6zTmrUeRas/maxresdefault.jpg',
      embedId: 'i6zTmrUeRas',
      description: 'Learn physics concepts with expert guidance'
    },
    {
      id: '2',
      title: 'Mathematics Problem Solving',
      thumbnail: 'https://img.youtube.com/vi/mzKkWSn2UpU/maxresdefault.jpg',
      embedId: 'mzKkWSn2UpU',
      description: 'Master mathematics with step-by-step solutions'
    },
    {
      id: '3',
      title: 'Chemistry Fundamentals',
      thumbnail: 'https://img.youtube.com/vi/BNLr7shM9Dg/maxresdefault.jpg',
      embedId: 'BNLr7shM9Dg',
      description: 'Understand chemistry concepts easily'
    },
    {
      id: '4',
      title: 'Science Concepts Explained',
      thumbnail: 'https://img.youtube.com/vi/ZNcyyDYPX3s/maxresdefault.jpg',
      embedId: 'ZNcyyDYPX3s',
      description: 'Comprehensive science learning made simple'
    }
  ];

  return (
    <section className="py-20 bg-background" ref={ref}>
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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
              <div className="card-gradient rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
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
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-4"
                    >
                      <Play className="text-white" size={32} />
                    </motion.div>
                  </div>
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
          <p className="text-muted-foreground mb-6">
            Want to access more educational content and live classes?
          </p>
          <motion.a
            href="https://youtube.com/@omegaproclasses?si=lFpCZHz2x9VBtJp9"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center gap-2"
          >
            Subscribe to Our Channel
            <ExternalLink size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTube;