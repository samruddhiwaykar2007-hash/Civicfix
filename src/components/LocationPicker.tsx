import React, { useState } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle, Building, Map } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../i18n/translations';

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  address: string;
  locationSource: 'gps_browser' | 'manual_address' | 'map_pin';
  onLocationChange: (data: {
    latitude?: number;
    longitude?: number;
    address: string;
    locationSource: 'gps_browser' | 'manual_address' | 'map_pin';
  }) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  address,
  locationSource,
  onLocationChange
}) => {
  const { language } = useAuth();
  const t = translations[language];

  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState(address);

  // Municipal ward presets for quick selection
  const municipalPresets = [
    {
      name: 'Dadar West, Ward G/North, Mumbai',
      lat: 19.0178,
      lng: 72.8358,
      address: 'Senapati Bapat Marg, Near Dadar Flower Market, Mumbai 400028'
    },
    {
      name: 'Shivaji Park, Cadell Road, Mumbai',
      lat: 19.0284,
      lng: 72.8386,
      address: 'Cadell Road, Shivaji Park, Dadar, Mumbai 400028'
    },
    {
      name: 'Bandra West, Ward H/West, Mumbai',
      lat: 19.0596,
      lng: 72.8295,
      address: 'Hill Road, Near Bandra Station, Mumbai 400050'
    },
    {
      name: 'Kothrud, Zone 3, Pune',
      lat: 18.5074,
      lng: 73.8077,
      address: 'DP Road, Near City Pride, Kothrud, Pune 411038'
    }
  ];

  const handleDetectGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Browser does not support Geolocation. Please type address manually.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const approxAccuracy = Math.round(position.coords.accuracy);

        // Simulated reverse geocode formatting for local clarity
        const formattedAddress = `GPS (${lat.toFixed(5)}, ${lng.toFixed(5)}) · ±${approxAccuracy}m accuracy · Municipal Ward Region`;

        setManualAddress(formattedAddress);
        onLocationChange({
          latitude: lat,
          longitude: lng,
          address: formattedAddress,
          locationSource: 'gps_browser'
        });
        setIsLocating(false);
      },
      error => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        let msg = 'Unable to fetch GPS location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please specify your address or select a ward preset below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location position unavailable. Please enter address manually.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'GPS request timed out. Please enter address manually.';
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualAddress(val);
    onLocationChange({
      latitude,
      longitude,
      address: val,
      locationSource: 'manual_address'
    });
  };

  const handleSelectPreset = (preset: typeof municipalPresets[0]) => {
    setManualAddress(preset.address);
    onLocationChange({
      latitude: preset.lat,
      longitude: preset.lng,
      address: preset.address,
      locationSource: 'map_pin'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">{t.locationTitle}</h4>
            <p className="text-xs text-slate-500">Accurate location is essential for dispatching field crews.</p>
          </div>
        </div>

        {/* Location Status Badge */}
        {locationSource === 'gps_browser' && latitude && longitude ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GPS Verified</span>
          </span>
        ) : locationSource === 'map_pin' ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Compass className="w-3.5 h-3.5" />
            <span>Ward Landmark Pin</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            <span>Manual Address</span>
          </span>
        )}
      </div>

      {/* GPS Action Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={handleDetectGps}
          disabled={isLocating}
          className="flex-1 py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs sm:text-sm font-semibold border border-sky-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 text-sky-600 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? t.detectingGps : t.detectGps}</span>
        </button>
      </div>

      {gpsError && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Coordinates readout if GPS captured */}
      {latitude && longitude && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-700 font-mono">
            <span className="font-semibold text-slate-500">Lat:</span> {latitude.toFixed(6)}
            <span className="font-semibold text-slate-500 ml-2">Lng:</span> {longitude.toFixed(6)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Source: {locationSource === 'gps_browser' ? 'Browser Geolocation API' : 'Preset Pin'}</span>
        </div>
      )}

      {/* Address Input Field */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {t.manualAddressLabel}
        </label>
        <div className="relative">
          <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={manualAddress}
            onChange={handleManualChange}
            placeholder={t.manualAddressPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
          />
        </div>
      </div>

      {/* Preset Ward Landmarks */}
      <div>
        <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Or Select Nearby Municipal Ward:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {municipalPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-2 text-left rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-colors flex items-center gap-2 text-xs text-slate-700"
            >
              <Map className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-slate-800 truncate">{preset.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{preset.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
