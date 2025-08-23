import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

type Video = {
  id: string;
  title: string;
  embedId: string;
  description?: string;
};

const CHANNEL_ID = 'UCOdQfV5_So-fyYFqcLAIm7Q'; // Omega Pro Classes 1112

// Optional server endpoint to bypass CORS entirely (recommended in prod)
const FEED_ENDPOINT = import.meta.env.VITE_YOUTUBE_FEED_URL as string | undefined;
// Public CORS-friendly proxy for read-only fetching (fallback for dev)
const PROXY_PREFIX = 'https://r.jina.ai/http://';

const YouTube = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadFeed() {
      try {
        // Prefer backend endpoint if provided; otherwise use proxy
        const url = FEED_ENDPOINT
          ? `${FEED_ENDPOINT}?channel_id=${CHANNEL_ID}&max=4`
          : `${PROXY_PREFIX}www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
        let latest: Video[] = [];
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          latest = (data.videos || []).slice(0, 4);
        } else {
          const text = await res.text();
          const parser = new DOMParser();
          const xml = parser.parseFromString(text, 'application/xml');
          const entries = Array.from(xml.getElementsByTagName('entry'));
          latest = entries.slice(0, 4).map((entry, idx) => {
            const title = entry.getElementsByTagName('title')[0]?.textContent || 'Untitled';
            const videoId = entry.getElementsByTagNameNS('http://www.youtube.com/xml/schemas/2015', 'videoId')[0]?.textContent
              || entry.getElementsByTagName('yt:videoId')[0]?.textContent
              || '';
            return {
              id: videoId || String(idx),
              title,
              embedId: videoId,
              description: 'Latest from our YouTube channel'
            } as Video;
          }).filter(v => v.embedId);
        }
        if (latest.length === 0) throw new Error('No videos found in feed');
        setVideos(latest);
        setError(null);
      } catch (e: any) {
        console.error('Failed to load YouTube feed', e);
        setError('Unable to load latest videos right now. Showing recent samples.');
        // Fallback to a small static list (existing examples)
        setVideos([
          { id: 'ZNcyyDYPX3s', title: 'Some Natural Phenomena', embedId: 'ZNcyyDYPX3s', description: 'By Rohan Sir' },
          { id: 'i6zTmrUeRas', title: 'Life Process- Class 10th', embedId: 'i6zTmrUeRas', description: 'By A.M. Jha Sir' },
          { id: 'Z4Nl97ibTvs', title: 'Electronic Configuration- Class 11th', embedId: 'Z4Nl97ibTvs', description: 'By A.M Jha Sir' },
          { id: 'J8z_euwH_Lw', title: 'Scalar Vector Tensor- Class 11th', embedId: 'J8z_euwH_Lw', description: 'By Chandra Shekhar Sir' }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
    return () => controller.abort();
  }, []);

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
          <p className="text-xl text-gray-900 dark:text-blue-200 max-w-3xl mx-auto">
            Watch our expert teachers explain complex concepts in simple, easy-to-understand ways
          </p>
          {loading && (
            <p className="text-sm text-muted-foreground mt-2">Loading latest videos…</p>
          )}
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
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
                    src={`https://www.youtube-nocookie.com/embed/${video.embedId}?rel=0&modestbranding=1&playsinline=1`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="w-full h-full"
                  />
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-muted-foreground mb-4">
                      {video.description}
                    </p>
                  )}

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
          className="text-center mt-12 justify-center flex flex-col items-center"
        >
          <p className="text-gray-900 dark:text-blue-200 mb-6">
            Want to access more educational content and live classes?
          </p>
          <div className="flex w-[50%] flex-col gap-4 justify-center">
            <motion.a
              href="https://youtube.com/@omegaproclasses?si=lFpCZHz2x9VBtJp9"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2  p-5 w-full text-center justify-center"
            >
              <span className="text-center">
                Subscribe our channel for class 7th to 10th
              </span>
              <ExternalLink size={16} />
            </motion.a>
            <motion.a
              href="https://youtube.com/@omegaproclasses1112?si=G-tY5W8cZkLNCC7f"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2 p-5 justify-center"
            >
              <span className="text-center">
                Subscribe our channel for class 11 and 12
              </span>
              <ExternalLink size={16} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTube;
