import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, RotateCw, ZoomIn, ZoomOut, Maximize, RefreshCw } from 'lucide-react';

interface ImageEditorModalProps {
  image: string;
  onClose: () => void;
  onSave: (editedImage: string) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ image, onClose, onSave }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeFilter, setActiveFilter] = useState('none');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const resetEdits = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setActiveFilter('none');
  };

  const FILTERS = [
    { name: 'Normal', value: 'none' },
    { name: 'Noir & Blanc', value: 'grayscale(100%)' },
    { name: 'Sépia', value: 'sepia(100%)' },
    { name: 'Vif', value: 'saturate(150%)' },
    { name: 'Doux', value: 'brightness(110%) contrast(90%)' },
  ];

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    filter = 'none'
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return '';
    }

    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central point to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    // apply filter
    if (filter !== 'none') {
      ctx.filter = filter;
    }

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    // set canvas width to final desired crop size - this will also clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(data, 0, 0);

    // As Base64 string
    return canvas.toDataURL('image/jpeg');
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = (rotation * Math.PI) / 180;

    return {
      width:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  const handleSave = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation, activeFilter);
        onSave(croppedImage);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111114] border border-[#1F1F23] rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Maximize className="text-indigo-500" size={20} />
            Éditeur d'Image Expert
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="relative flex-1 min-h-[400px] bg-[#0A0A0C]">
          <div style={{ filter: activeFilter === 'none' ? undefined : activeFilter }} className="w-full h-full">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={16 / 9}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        </div>

        <div className="p-6 bg-[#111114] space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
             {FILTERS.map(f => (
               <button
                 key={f.value}
                 onClick={() => setActiveFilter(f.value)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeFilter === f.value ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
               >
                 {f.name}
               </button>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-6">
            {/* Zoom Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-2"><ZoomIn size={14} className="text-indigo-400" /> Zoom</span>
                <span className="text-indigo-400 font-mono tracking-tighter">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="p-1 text-gray-500 hover:text-white transition-colors"><ZoomOut size={16} /></button>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-1 text-gray-500 hover:text-white transition-colors"><ZoomIn size={16} /></button>
              </div>
            </div>

            {/* Rotation Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-2"><RotateCw size={14} className="text-indigo-400" /> Rotation</span>
                <span className="text-indigo-400 font-mono tracking-tighter">{rotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setRotation((rotation - 90 + 360) % 360)} className="text-gray-500 hover:text-white"><RotateCw size={16} className="rotate-180" /></button>
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <button onClick={() => setRotation((rotation + 90) % 360)} className="text-gray-500 hover:text-white"><RotateCw size={16} /></button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1F1F23]">
            <button
              onClick={resetEdits}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <RefreshCw size={14} /> Réinitialiser
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-[#1F1F23] text-gray-400 font-bold hover:bg-white/5 transition-all text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 text-sm"
              >
                <Check size={20} />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
