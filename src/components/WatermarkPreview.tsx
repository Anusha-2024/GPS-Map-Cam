import React, { useRef, useEffect, useState } from 'react';
import { Download, Settings, Eye, MapPin } from 'lucide-react';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { LocationData, TimestampData, WatermarkOptions } from '../types';

interface WatermarkPreviewProps {
  image: string;
  locationData: LocationData | null;
  timestampData: TimestampData;
  watermarkOptions: WatermarkOptions;
  onOptionsChange: (options: WatermarkOptions) => void;
}

const WatermarkPreview: React.FC<WatermarkPreviewProps> = ({
  image,
  locationData,
  timestampData,
  watermarkOptions,
  onOptionsChange,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ];

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const generateWatermarkText = () => {
    if (!locationData) return {
      location: '',
      address: '',
      coordinates: '',
    };

    const timestamp = format(timestampData.date, 'dd/MM/yyyy HH:mm');
    const coordinates = `Lat ${locationData.latitude.toFixed(6)} Long ${locationData.longitude.toFixed(6)}`;

    return {
      title: 'GPS Map Camera',
      location: locationData.placeName || locationData.address,
      address: locationData.address,
      coordinates: `${coordinates} ${timestamp} GMT ${timestampData.timezone}`,
    };
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;

    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `gps-watermarked-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const watermarkText = generateWatermarkText();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Preview & Export</h3>
        </div>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showOptions && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Watermark Options</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                value={watermarkOptions.position}
                onChange={(e) => onOptionsChange({ ...watermarkOptions, position: e.target.value as any })}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {positions.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="range"
                min="10"
                max="18"
                value={watermarkOptions.fontSize}
                onChange={(e) => onOptionsChange({ ...watermarkOptions, fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{watermarkOptions.fontSize}px</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacity
              </label>
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.1"
                value={watermarkOptions.opacity}
                onChange={(e) => onOptionsChange({ ...watermarkOptions, opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{Math.round(watermarkOptions.opacity * 100)}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <input
                type="color"
                value={watermarkOptions.textColor}
                onChange={(e) => onOptionsChange({ ...watermarkOptions, textColor: e.target.value })}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div ref={previewRef} className="relative inline-block overflow-hidden">
          <img src={image} alt="Preview" className="max-w-full max-h-[60vh] object-contain" />
          {locationData && (
            <div
              className={`absolute ${getPositionClasses(watermarkOptions.position)} rounded-lg`}
              style={{
                opacity: watermarkOptions.opacity,
                backgroundColor: watermarkOptions.backgroundColor,
                padding: '0.5rem 0.75rem',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <div
                className="flex flex-wrap items-center max-w-full mx-auto text-white"
                style={{
                  fontSize: `${watermarkOptions.fontSize * 0.8}px`,
                  lineHeight: '1.2',
                  color: watermarkOptions.textColor,
                }}
              >
                {/* Map Icon */}
                <div className="flex items-center flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-20">
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: watermarkOptions.textColor }}
                    />
                  </div>
                </div>

                    {/* Location and Address */}
                    <div className="flex-1 min-w-0 max-w-[70%] break-words">
                      {/* Removed location text as per user request */}
                      {/* <div className="font-semibold text-base">{watermarkText.location}</div> */}
                      <div
                        className="text-xs"
                        style={{ textAlign: 'justify' }}
                      >
                        {watermarkText.address}
                      </div>
                    </div>

                    {/* Coordinates and Time */}
                    <div className="flex flex-col items-start flex-shrink-0 ml-3 min-w-max text-xs font-mono space-y-1">
                      <div className="text-center">
                        Lat {locationData.latitude.toFixed(6)} Long{' '}
                        {locationData.longitude.toFixed(6)}
                      </div>
                      <div className="text-center">
                        {format(timestampData.date, 'dd/MM/yyyy HH:mm')} GMT{' '}
                        {timestampData.timezone}
                      </div>
                    </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div></div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">

        <button
          onClick={downloadImage}
          disabled={!locationData || isDownloading}
          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div>
            {isDownloading ? (
              <div>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div>
                <Download className="w-5 h-5" />
                <span>Download Image</span>
              </div>
            )}
          </div>
        </button>

        <button
          onClick={() => setShowOptions(!showOptions)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
        >
          Customize
        </button>
      </div>

      {!locationData && (
        <div className="text-center py-4">
          <p className="text-gray-500">
            Select a location on the map to preview the watermark
          </p>
        </div>
      )}
    </div>
  );
};

export default WatermarkPreview;


