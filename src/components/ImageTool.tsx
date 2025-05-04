import React, { useState, useRef } from 'react';
import { Upload, Download, Image, Info, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import ToolHeader from './ToolHeader';

export default function ImageTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [settings, setSettings] = useState({
    maxSizeMB: 1,
    maxWidthOrHeight: 1920
  });
  
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setCompressedImage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setCompressedImage(null);
    }
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-500', 'bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    }
  };

  const handleZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      const compressedFile = await imageCompression(selectedFile, {
        ...settings,
        useWebWorker: true
      });
      
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setCompressedImage(reader.result as string);
        setLoading(false);
      };
    } catch (error) {
      console.error('Error compressing image:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-container">
        <ToolHeader 
          title="Image Compressor" 
          description="Optimize your images without losing quality"
        />
        
        {showGuide && (
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>1. Drop an image file or click to select</li>
                    <li>2. Adjust compression settings if needed</li>
                    <li>3. Click "Compress Image" to start</li>
                    <li>4. Download your compressed image</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-8">
          <div
            ref={dropZoneRef}
            onClick={handleZoneClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="tool-card p-8 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-slate-200 transition-colors duration-200 cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <div className="flex flex-col items-center gap-4">
              {selectedFile ? (
                <Image className="w-16 h-16 text-blue-500" />
              ) : (
                <Upload className="w-16 h-16 text-slate-400" />
              )}
              <div className="text-center">
                <p className="text-lg font-medium text-slate-700 mb-1">
                  {selectedFile ? selectedFile.name : 'Drop your image here'}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedFile ? 'Click to change file' : 'or click to browse'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxSizeMB}
                onChange={(e) => setSettings({ ...settings, maxSizeMB: Number(e.target.value) })}
                className="input-field"
                min="0.1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Width/Height (px)
              </label>
              <input
                type="number"
                value={settings.maxWidthOrHeight}
                onChange={(e) => setSettings({ ...settings, maxWidthOrHeight: Number(e.target.value) })}
                className="input-field"
                min="100"
                step="100"
              />
            </div>
          </div>

          <button
            onClick={handleCompress}
            disabled={!selectedFile || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Compressing...' : 'Compress Image'}
          </button>

          {compressedImage && (
            <div className="space-y-6">
              <div className="border rounded-xl overflow-hidden">
                <img 
                  src={compressedImage} 
                  alt="Compressed" 
                  className="w-full h-auto"
                />
              </div>
              <a
                href={compressedImage}
                download="compressed-image.jpg"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Compressed Image
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}