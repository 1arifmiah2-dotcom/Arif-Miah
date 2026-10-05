import React, { useState } from 'react';
import { Story } from '../../types';
import { auraStorage } from '../../services/storage';
import { X, Image, Type, Sparkles, Check, Camera, Shield } from 'lucide-react';

interface StoryCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveCamera?: () => void;
}

const GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)',
  'linear-gradient(135deg, #e11d48 0%, #c026d3 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #0f172a 0%, #312e81 100%)',
];

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
];

export const StoryCreatorModal: React.FC<StoryCreatorModalProps> = ({
  isOpen,
  onClose,
  onOpenLiveCamera,
}) => {
  const [mode, setMode] = useState<'text' | 'photo'>('text');
  const [text, setText] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0]);
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState<'everyone' | 'contacts' | 'close_friends'>('everyone');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedPhoto(url);
      setMode('photo');
    }
  };

  const handlePublish = () => {
    if (mode === 'text') {
      if (!text.trim()) return;
      auraStorage.addStory('text', undefined, text.trim(), selectedGradient, privacy);
    } else {
      auraStorage.addStory('photo', selectedPhoto, caption.trim() || undefined, undefined, privacy);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">Create 24h Story</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1 bg-slate-800/80 rounded-2xl my-3 text-xs font-semibold">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              mode === 'text' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text Story</span>
          </button>
          <button
            onClick={() => setMode('photo')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              mode === 'photo' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Photo Story</span>
          </button>
        </div>

        {/* Story Canvas Preview */}
        <div className="w-full h-64 rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center text-center p-6 shadow-inner">
          {mode === 'text' ? (
            <div
              className="absolute inset-0 flex items-center justify-center p-6"
              style={{ background: selectedGradient }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your story here..."
                maxLength={140}
                className="w-full bg-transparent text-center text-white placeholder-white/60 text-lg font-bold resize-none focus:outline-none drop-shadow-md"
                rows={4}
                autoFocus
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col justify-end">
              <img
                src={selectedPhoto}
                alt="Selected"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
              <div className="relative p-3 z-10">
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full bg-black/60 border border-white/20 rounded-xl py-1.5 px-3 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls based on mode */}
        {mode === 'text' ? (
          <div className="my-3">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Gradient Style</span>
            <div className="flex gap-2 justify-center">
              {GRADIENTS.map((grad, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedGradient(grad)}
                  className={`w-9 h-9 rounded-xl transition ${
                    selectedGradient === grad ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ background: grad }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="my-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Choose Photo</span>
              <label className="text-xs text-indigo-400 font-semibold cursor-pointer hover:underline">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PRESET_PHOTOS.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(src)}
                  className={`relative h-14 rounded-xl overflow-hidden border transition ${
                    selectedPhoto === src
                      ? 'border-indigo-500 ring-2 ring-indigo-500'
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="preset" className="w-full h-full object-cover" />
                  {selectedPhoto === src && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Selector */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Story Privacy
            </span>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as Story['privacy'])}
              className="bg-slate-800 text-xs text-white rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">Contacts Only</option>
              <option value="close_friends">Close Friends</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePublish}
          disabled={mode === 'text' && !text.trim()}
          className="w-full mt-3 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          Share to Your Story (24h)
        </button>
      </div>
    </div>
  );
};
