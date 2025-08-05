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
      title: 'Mathematics Problem Solving Techniques',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      embedId: 'dQw4w9WgXcQ',
      description: 'Learn effective problem-solving strategies for mathematics'
    },
    {
      id: '2',
      title: 'Physics Concepts Made Easy',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      embedId: 'dQw4w9WgXcQ',
      description: 'Understanding complex physics concepts with simple explanations'
    },
    {
      id: '3',
      title: 'Chemistry Laboratory Techniques',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      embedId: 'dQw4w9WgXcQ',
      description: 'Essential chemistry lab techniques for students'
    },
    {
      id: '4',
      title: 'Biology Study Strategies',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      embedId: 'dQw4w9WgXcQ',
      description: 'Effective methods to study and remember biology concepts'
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
                    <span className="text-sm text-primary font-medium">
                      Watch Now
                    </span>
                    <ExternalLink className="text-primary group-hover:translate-x-1 transition-transform" size={16} />
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            Subscribe to Our Channel
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTube;