import React, { useState, useEffect } from 'react';
import { MapPin, Search, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { LocationData } from '../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
}

interface MapEventsProps {
  onLocationClick: (lat: number, lng: number) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onLocationClick }) => {
  useMapEvents({
    click: (e) => {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number]>([12.82464, 80.046536]);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        placeName: data.name || data.address?.road || 'Selected Location',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        country: data.address?.country || '',
        postalCode: data.address?.postcode || ''
      };

      onLocationSelect(locationData);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Fallback location data
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        placeName: 'Selected Location',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      };
      onLocationSelect(locationData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLocation = () => {
    if (!manualLocation.trim()) return;
    
    const locationData: LocationData = {
      latitude: position[0],
      longitude: position[1],
      address: manualLocation,
      placeName: manualLocation,
      city: '',
      state: '',
      country: '',
      postalCode: ''
    };
    
    onLocationSelect(locationData);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          reverseGeocode(lat, lng);
        },
        (error) => {
          console.error('Geolocation failed:', error);
          alert('Unable to get your current location. Please select manually on the map.');
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Select Location</h3>
      </div>

      {/* Search Bar */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for hospitals, landmarks, buildings..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Search
        </button>
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          title="Use current location"
        >
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* Manual Location Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
          placeholder="Or type location manually (e.g., Dr. Vimal Hospital, Patna, Bihar)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleManualLocation}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Use Manual
        </button>
      </div>

      {/* Map */}
      <div className="relative">
        <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            key={`${position[0]}-${position[1]}`}
          >
            {/* Satellite imagery base layer */}
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
            {/* Detailed labels and POI overlay - includes hospitals, businesses, landmarks */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              opacity={0.6}
            />
            {/* Additional detailed POI layer for better visibility of hospitals and amenities */}
            <TileLayer
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png"
              attribution="Map tiles by Stamen Design, CC BY 3.0 &mdash; Map data &copy; OpenStreetMap contributors"
              opacity={0.8}
            />
            <Marker position={position} />
            <MapEvents onLocationClick={handleMapClick} />
          </MapContainer>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Loading location...</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Click anywhere on the satellite map to select a location</p>
        <p>• Search for hospitals, landmarks, buildings, or any specific place</p>
        <p>• Use the crosshair button to get your current location</p>
        <p>• All place names, hospitals, and POIs are now visible on the map</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Current coordinates:</span> {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      </div>
    </div>
  );
};

export default LocationSelector;