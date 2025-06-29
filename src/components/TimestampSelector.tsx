import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { TimestampData } from '../types';
import exifr from 'exifr';

interface TimestampSelectorProps {
  data: TimestampData;
  onChange: (data: TimestampData) => void;
  imageFile: File | null;
}

const TimestampSelector: React.FC<TimestampSelectorProps> = ({ data, onChange, imageFile }) => {
  const [useAutoDetected, setUseAutoDetected] = useState(true);
  const [autoDetectedDate, setAutoDetectedDate] = useState<Date | null>(null);

  const timezones = [
    { value: '+05:30', label: 'GMT +05:30 (India)' },
    { value: '+00:00', label: 'GMT +00:00 (UTC)' },
    { value: '-05:00', label: 'GMT -05:00 (EST)' },
    { value: '-08:00', label: 'GMT -08:00 (PST)' },
    { value: '+01:00', label: 'GMT +01:00 (CET)' },
    { value: '+08:00', label: 'GMT +08:00 (CST)' },
    { value: '+09:00', label: 'GMT +09:00 (JST)' },
  ];

  useEffect(() => {
    const extractExifData = async () => {
      if (!imageFile) return;

      try {
        const exifData = await exifr.parse(imageFile);
        if (exifData && exifData.DateTimeOriginal) {
          const exifDate = new Date(exifData.DateTimeOriginal);
          setAutoDetectedDate(exifDate);
          if (useAutoDetected) {
            onChange({ ...data, date: exifDate });
          }
        }
      } catch (error) {
        console.error('Failed to extract EXIF data:', error);
      }
    };

    extractExifData();
  }, [imageFile]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange({ ...data, date });
    }
  };

  const handleTimezoneChange = (timezone: string) => {
    onChange({ ...data, timezone });
  };

  const toggleAutoDetected = () => {
    const newUseAutoDetected = !useAutoDetected;
    setUseAutoDetected(newUseAutoDetected);
    
    if (newUseAutoDetected && autoDetectedDate) {
      onChange({ ...data, date: autoDetectedDate });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Set Date & Time</h3>
      </div>

      {autoDetectedDate && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                Auto-detected from photo EXIF data
              </p>
              <p className="text-sm text-green-600">
                {format(autoDetectedDate, 'PPpp')}
              </p>
            </div>
            <button
              onClick={toggleAutoDetected}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                useAutoDetected
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {useAutoDetected ? 'Using Auto' : 'Use Auto'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date & Time
          </label>
          <DatePicker
            selected={data.date}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={useAutoDetected && !!autoDetectedDate}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={data.timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Final timestamp:</span>{' '}
          {format(data.date, 'dd/MM/yyyy HH:mm')} GMT {data.timezone}
        </p>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Date and time will appear in the watermark</p>
        <p>• EXIF data is automatically extracted when available</p>
        <p>• You can override auto-detected values by disabling "Use Auto"</p>
      </div>
    </div>
  );
};

export default TimestampSelector;