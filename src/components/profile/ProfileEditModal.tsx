import React, { useState } from 'react';
import { User } from '../../types';
import { auraStorage } from '../../services/storage';
import { X, Camera, Check, User as UserIcon, Mail, Phone, FileText } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [phone, setPhone] = useState(currentUser.phone);
  const [isOnline, setIsOnline] = useState(currentUser.isOnline);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    auraStorage.updateUser({
      id: currentUser.id,
      name: name.trim(),
      username: username.trim(),
      bio: bio.trim(),
      avatar,
      phone: phone.trim(),
      isOnline,
      lastSeen: isOnline ? 'Active now' : 'Just now',
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white">Edit Profile</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="py-4 space-y-3.5">
          {/* Avatar edit */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <Avatar src={avatar} name={name} size="2xl" />
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg transition">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-[11px] text-slate-400 mt-2">Change profile picture</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Username</label>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-400 focus-within:border-indigo-500">
              <span className="mr-1">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              maxLength={120}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-white">Online Status</p>
              <p className="text-[10px] text-slate-400">Show when you are active</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  isOnline ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
          >
            {saved ? (
              <span className="flex items-center gap-1 text-emerald-300">
                <Check className="w-4 h-4" /> Profile Updated!
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
