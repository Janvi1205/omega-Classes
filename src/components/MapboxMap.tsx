import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface MapboxMapProps {
  className?: string;
}

const MapboxMap = ({ className = "w-full h-60 sm:h-80" }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [error, setError] = useState('');

  // Coordinates for Patna, Bihar, India (approximate location of Kankarbagh)
  const patnaCoordinates: [number, number] = [85.1376, 25.5941]; // [longitude, latitude]

  const initializeMap = async (token: string) => {
    try {
      // Dynamically import mapbox-gl to avoid SSR issues
      const mapboxgl = (await import('mapbox-gl')).default;
      
      if (!mapContainer.current) return;

      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: patnaCoordinates,
        zoom: 15,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add a marker for the exact location
      new mapboxgl.Marker({
        color: '#3B82F6', // Blue color
        scale: 1.2
      })
        .setLngLat(patnaCoordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              '<div class="p-2"><h3 class="font-semibold">Omega Pro Classes</h3><p class="text-sm">Flat No. 102, Lalti Apartment<br>Kali Mandir Road, Hanuman Nagar<br>Kankarbagh, Patna - 800020</p></div>'
            )
        )
        .addTo(map.current);

      setShowTokenInput(false);
      setError('');
    } catch (err) {
      setError('Failed to load map. Please check your Mapbox token.');
      console.error('Map initialization error:', err);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken.trim());
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center p-6`}>
        <div className="text-center max-w-md">
          <MapPin size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-4 text-foreground">Enable Interactive Map</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Mapbox public token to view our location on an interactive map.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-3">
            <input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="Enter Mapbox public token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              Load Map
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Get your token from:{' '}
            <a
              href="https://mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative rounded-2xl overflow-hidden`}>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapboxMap;