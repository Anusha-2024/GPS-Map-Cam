export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  placeName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  magnitude?: number | null;
}

export interface TimestampData {
  date: Date;
  timezone: string;
}

export interface WatermarkOptions {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  fontSize: number;
  opacity: number;
  backgroundColor: string;
  textColor: string;
}
