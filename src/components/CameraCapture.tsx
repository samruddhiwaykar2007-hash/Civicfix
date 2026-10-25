import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Trash2, Video, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../i18n/translations';

interface CameraCaptureProps {
  imageDataUrl: string | null;
  setImageDataUrl: (url: string | null) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  imageDataUrl,
  setImageDataUrl
}) => {
  const { language } = useAuth();
  const t = translations[language];

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Live camera access failed or denied:', err);
      setCameraError('Camera access unavailable or permission was not granted. Please select an image file below.');
      setIsCameraActive(false);
      // Fallback to file input
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImageDataUrl(dataUrl);
      stopCameraStream();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Sample real civic issue images for instant test/demo
  const samplePhotos = [
    {
      label: language === 'mr' ? 'रस्त्यावरील खड्डा' : language === 'hi' ? 'सड़क का गड्ढा' : 'Road Pothole',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: language === 'mr' ? 'कचऱ्याचे साम्राज्य' : language === 'hi' ? 'कचरे का ढेर' : 'Garbage Waste',
      url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: language === 'mr' ? 'बंद पथदिवा' : language === 'hi' ? 'खराब स्ट्रीट लाइट' : 'Streetlight Outage',
      url: 'https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: language === 'mr' ? 'पाण्याची पाईप गळती' : language === 'hi' ? 'जल पाइपलाइन लीकेज' : 'Water Pipeline Leak',
      url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* If photo is selected */}
      {imageDataUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-sky-200 bg-slate-900 group shadow-md">
          <img
            src={imageDataUrl}
            alt="Captured civic issue"
            className="w-full h-64 sm:h-80 object-cover"
          />
          <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Photo Verified for AI Inspection</span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setImageDataUrl(null);
                startLiveCamera();
              }}
              className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold hover:bg-white flex items-center gap-1.5 shadow-md transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.retakePhoto}</span>
            </button>
            <button
              type="button"
              onClick={() => setImageDataUrl(null)}
              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-all"
              title={t.removePhoto}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : isCameraActive ? (
        /* Live Camera Viewfinder */
        <div className="relative rounded-2xl overflow-hidden border-2 border-sky-400 bg-black shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Live Camera Feed</span>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={captureFrame}
              className="w-16 h-16 rounded-full bg-white border-4 border-sky-500 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              title="Capture Photograph"
            >
              <div className="w-10 h-10 rounded-full bg-sky-500" />
            </button>
            <button
              type="button"
              onClick={stopCameraStream}
              className="px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-medium hover:bg-black/80"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Empty Capture State */
        <div className="border-2 border-dashed border-sky-200 rounded-2xl p-6 sm:p-8 bg-sky-50/40 text-center hover:border-sky-300 transition-colors">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
            <Camera className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-base mb-1">
            {t.photoStepSubtitle}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            Photographs allow Gemini AI to detect physical evidence, estimate severity, and route to the correct municipal field ward.
          </p>

          {cameraError && (
            <div className="mb-4 p-2.5 bg-amber-50 text-amber-800 rounded-xl text-xs max-w-md mx-auto border border-amber-200">
              {cameraError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={startLiveCamera}
              className="px-4 py-2.5 rounded-xl bg-sky-600 text-white text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-sm shadow-sky-200 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>{t.capturePhoto}</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 shadow-xs flex items-center gap-2 transition-transform active:scale-95"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>{t.uploadPhoto}</span>
            </button>
          </div>

          {/* Quick preset photo buttons for instant demo testing */}
          <div className="mt-6 pt-5 border-t border-sky-100 text-left">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
              <span>Quick Test Samples (Click to load):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samplePhotos.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageDataUrl(sample.url)}
                  className="p-2 rounded-xl border border-sky-100 bg-white hover:bg-sky-50 text-left transition-colors flex items-center gap-2 text-xs text-slate-700 font-medium group"
                >
                  <img
                    src={sample.url}
                    alt={sample.label}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <span className="truncate group-hover:text-sky-700">{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
