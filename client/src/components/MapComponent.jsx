import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

const center = {
  lat: 20.5937, // Center of India
  lng: 78.9629
};

const MapComponent = ({ jobs }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Custom styling for a dark-mode-first premium aesthetic
  const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1A1F2C" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1A1F2C" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#94A3B8" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#F8FAFC" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0B0F19" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#252B3B" }]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#334155" }]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#252B3B" }]
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#252B3B" }]
    }
  ];

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {jobs && jobs.map(job => {
          // Check if coordinates exist and are valid before rendering
          if (!job.coordinates || !job.coordinates.coordinates || job.coordinates.coordinates.length < 2) return null;
          
          return (
            <Marker
              key={job._id}
              position={{
                lat: job.coordinates.coordinates[1], // Mongoose GeoJSON stores as [lng, lat]
                lng: job.coordinates.coordinates[0]
              }}
              onClick={() => setSelectedJob(job)}
              icon={{
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                fillColor: '#10B981', // Neon accent color
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#0B0F19',
                scale: 1.5,
                anchor: new window.google.maps.Point(12, 24),
              }}
            />
          )
        })}

        {selectedJob && (
          <InfoWindow
            position={{
              lat: selectedJob.coordinates.coordinates[1],
              lng: selectedJob.coordinates.coordinates[0]
            }}
            onCloseClick={() => setSelectedJob(null)}
          >
            <div className="p-2 max-w-[200px]" style={{ backgroundColor: '#1A1F2C', color: '#F8FAFC' }}>
              <h3 className="font-bold text-sm text-primary">{selectedJob.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedJob.company}</p>
              <p className="text-xs mt-1 text-accent">{selectedJob.location}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
  ) : <div className="w-full h-full flex items-center justify-center bg-surface text-text-secondary animate-pulse rounded-xl border border-border">Loading Map...</div>;
};

export default React.memo(MapComponent);
