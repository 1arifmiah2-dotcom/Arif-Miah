import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageMedia } from '../../types';
import { voiceRecorder } from '../../services/voiceRecorder';
import {
  Send,
  Smile,
  Mic,
  Camera,
  Image,
  Paperclip,
  X,
  Trash2,
  Check,
  Film,
  Sparkles,
  StopCircle,
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, media?: MessageMedia) => void;
  replyToMessage: Message | null;
  onCancelReply: () => void;
  editingMessage: Message | null;
  onCancelEdit: () => void;
  onSaveEdit: (newText: string) => void;
  onOpenLiveCamera: () => void;
}

const COMMON_EMOJIS = [
  '😀', '😂', '🥰', '😍', '😎', '🥳', '🤔', '🔥', '✨', '👍',
  '❤️', '🙏', '🎉', '💯', '🚀', '☕', '💡', '⚡', '👀', '💪',
  '🙌', '👏', '🎯', '🏝️', '🍕', '🍻', '🌈', '🤩', '👋', '⭐',
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  replyToMessage,
  onCancelReply,
  editingMessage,
  onCancelEdit,
  onSaveEdit,
  onOpenLiveCamera,
}) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const recordTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync editing message text
  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text);
      if (textareaRef.current) textareaRef.current.focus();
    }
  }, [editingMessage]);

  const handleSend = () => {
    if (editingMessage) {
      if (!text.trim()) return;
      onSaveEdit(text.trim());
      setText('');
      return;
    }

    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice note handling
  const startVoiceRecording = async () => {
    const success = await voiceRecorder.startRecording();
    if (!success) return;

    setIsRecordingVoice(true);
    setRecordDuration(0);

    recordTimerRef.current = window.setInterval(() => {
      setRecordDuration((s) => s + 1);
    }, 1000);
  };

  const stopVoiceRecordingAndSend = async () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    const result = await voiceRecorder.stopRecording();
    setIsRecordingVoice(false);

    if (result && result.duration >= 1) {
      const audioMedia: MessageMedia = {
        type: 'audio',
        url: result.url,
        duration: result.duration,
        waveform: result.waveform,
        size: result.size,
      };
      onSendMessage('', audioMedia);
    }
  };

  const cancelVoiceRecording = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    voiceRecorder.cancelRecording();
    setIsRecordingVoice(false);
    setRecordDuration(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    const url = URL.createObjectURL(file);

    const media: MessageMedia = {
      type: isVideo ? 'video' : isImage ? 'image' : 'file',
      url,
      name: file.name,
      size: file.size,
    };

    onSendMessage('', media);
    setShowAttachMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="shrink-0 bg-slate-950/95 border-t border-slate-800/80 px-2.5 py-2 relative z-20">
      {/* Reply Banner */}
      {replyToMessage && (
        <div className="mb-2 p-2 rounded-xl bg-slate-900 border-l-4 border-indigo-500 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
          <div className="min-w-0 pr-2">
            <span className="font-semibold text-indigo-400 block truncate">
              Replying to {replyToMessage.senderName}
            </span>
            <span className="text-slate-300 truncate block text-[11px]">
              {replyToMessage.text || 'Media attachment'}
            </span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editing Banner */}
      {editingMessage && (
        <div className="mb-2 p-2 rounded-xl bg-slate-900 border-l-4 border-amber-500 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
          <span className="font-semibold text-amber-400">Editing message</span>
          <button
            onClick={onCancelEdit}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-3 mb-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-30 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
            <span>Emojis & Stickers</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {COMMON_EMOJIS.map((em) => (
              <button
                key={em}
                onClick={() => {
                  setText((prev) => prev + em);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="text-xl p-1.5 rounded-lg hover:bg-slate-800 transition active:scale-95 flex items-center justify-center"
              >
                {em}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Popover */}
      {showAttachMenu && (
        <div className="absolute bottom-full left-4 mb-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-30 flex flex-col gap-1 w-44 animate-in fade-in">
          <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 text-xs font-medium text-slate-200 cursor-pointer transition">
            <Image className="w-4 h-4 text-emerald-400" />
            <span>Photo / Video</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              setShowAttachMenu(false);
              onOpenLiveCamera();
            }}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 text-xs font-medium text-slate-200 transition text-left"
          >
            <Camera className="w-4 h-4 text-indigo-400" />
            <span>Open Camera</span>
          </button>
        </div>
      )}

      {/* Voice Recording Active Bar */}
      {isRecordingVoice ? (
        <div className="flex items-center justify-between bg-rose-950/60 border border-rose-500/40 rounded-2xl px-3 py-2 text-rose-200">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-semibold">
              Recording Voice... {Math.floor(recordDuration / 60)}:
              {(recordDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cancelVoiceRecording}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-rose-400 transition"
              title="Cancel recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={stopVoiceRecordingAndSend}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-rose-600/40"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>
        </div>
      ) : (
        /* Regular Input Controls */
        <div className="flex items-end gap-1.5">
          {/* Attachment Toggle */}
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Emoji Toggle */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Emoji & stickers"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Text Area */}
          <div className="flex-1 min-h-[38px] max-h-24 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 flex items-center focus-within:border-indigo-500 transition">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={1}
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 resize-none focus:outline-none max-h-20 no-scrollbar"
            />
          </div>

          {/* Camera Quick Button */}
          {!text.trim() && (
            <button
              onClick={onOpenLiveCamera}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              title="Quick Camera"
            >
              <Camera className="w-5 h-5" />
            </button>
          )}

          {/* Voice Record / Send Button */}
          {text.trim() || editingMessage ? (
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition shrink-0 shadow-md shadow-indigo-600/30 active:scale-95"
              title="Send"
            >
              {editingMessage ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
          ) : (
            <button
              onClick={startVoiceRecording}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0 active:scale-95 shadow-sm"
              title="Hold to record voice message"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
