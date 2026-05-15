import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const ImageCropper = ({ image, aspect, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleConfirm = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImageBlob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] w-full max-w-4xl rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-white leading-none">Ajustar Banner</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Arraste para posicionar a melhor parte da imagem</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-[#050505] overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            classes={{
              containerClassName: "bg-[#050505]",
              mediaClassName: "opacity-90",
              cropAreaClassName: "border-2 border-[#00ff88] shadow-[0_0_50px_rgba(0,255,136,0.2)]"
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex-1 flex items-center gap-4">
              <ZoomOut size={16} className="text-gray-500" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00ff88]"
              />
              <ZoomIn size={16} className="text-gray-500" />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white group"
                title="Resetar"
              >
                <RotateCcw size={20} className="group-hover:rotate-[-90deg] transition-transform duration-500" />
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-[2] py-4 px-6 bg-[#00ff88] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(0,255,136,0.2)]"
            >
              <Check size={18} /> Confirmar Posição
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
