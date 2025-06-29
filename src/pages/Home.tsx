import React, { useState, useRef } from 'react';
import ImageUpload from '../components/ImageUpload';
import LocationSelector from '../components/LocationSelector';
import TimestampSelector from '../components/TimestampSelector';
import WatermarkPreview from '../components/WatermarkPreview';
import { LocationData, TimestampData, WatermarkOptions } from '../types';

const Home: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [timestampData, setTimestampData] = useState<TimestampData>({
    date: new Date(),
    timezone: '+05:30'
  });
  const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>({
    position: 'bottom-left',
    fontSize: 16,
    opacity: 0.9,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#ffffff'
  });

  const handleImageUpload = (file: File, dataUrl: string) => {
    setImageFile(file);
    setUploadedImage(dataUrl);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Add GPS Location to Your Photos
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your photo, select a precise location on the map, and create a professional 
          watermark with GPS coordinates, timestamp, and location details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>
          </div>

          {uploadedImage && (
            <>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <LocationSelector onLocationSelect={setLocationData} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <TimestampSelector 
                    data={timestampData}
                    onChange={setTimestampData}
                    imageFile={imageFile}
                  />
                </div>
              </div>

            </>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          {uploadedImage && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <WatermarkPreview
                  image={uploadedImage}
                  locationData={locationData}
                  timestampData={timestampData}
                  watermarkOptions={watermarkOptions}
                  onOptionsChange={setWatermarkOptions}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
