import React from 'react';
import { MapPin, Camera, Clock, Download, Smartphone, Globe } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Camera,
      title: 'Photo Upload',
      description: 'Drag & drop or select photos from your device gallery with support for JPG and PNG formats.'
    },
    {
      icon: MapPin,
      title: 'Interactive Maps',
      description: 'Use satellite view maps to pinpoint exact locations with precise GPS coordinates.'
    },
    {
      icon: Clock,
      title: 'Timestamp Control',
      description: 'Add custom dates and times, or extract EXIF data automatically from your photos.'
    },
    {
      icon: Download,
      title: 'High-Quality Export',
      description: 'Download your watermarked photos in full resolution with professional formatting.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Works seamlessly on all devices with responsive design and PWA capabilities.'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Search and select locations worldwide with detailed address information.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          About GPS Map Camera
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A professional tool for adding GPS location watermarks to your photos. 
          Perfect for documentation, real estate, construction, and travel photography.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Why Choose GPS Map Camera?
        </h3>
        <div className="max-w-2xl mx-auto space-y-4 text-gray-700">
          <p>
            Unlike basic photo editing apps, GPS Map Camera specializes in creating 
            professional location watermarks with precise GPS coordinates, making it 
            ideal for business documentation and legal purposes.
          </p>
          <p>
            Our tool works entirely in your browser - no uploads to external servers, 
            ensuring your photos remain private and secure. The watermarks are embedded 
            directly into the image for permanent documentation.
          </p>
          <p>
            Whether you're documenting construction progress, real estate properties, 
            or travel memories, GPS Map Camera provides the precision and professionalism 
            you need.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;