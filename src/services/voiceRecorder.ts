/**
 * Real Voice Note Recorder for Aura Messenger
 * Uses MediaRecorder & AudioContext to record voice clips and generate
 * real audio waveforms.
 */

export interface VoiceRecordingResult {
  url: string;
  duration: number;
  waveform: number[];
  size: number;
}

class VoiceRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private waveformData: number[] = [];
  private waveformInterval: number | null = null;
  private stream: MediaStream | null = null;

  async startRecording(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.waveformData = [];
      this.startTime = Date.now();

      // Audio analysis for visualizer
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      const source = this.audioCtx.createMediaStreamSource(this.stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.waveformInterval = window.setInterval(() => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = Math.min(100, Math.max(15, Math.round((sum / bufferLength / 255) * 100)));
        this.waveformData.push(avg);
      }, 150);

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.warn('Microphone access denied or unsupported:', err);
      return false;
    }
  }

  stopRecording(): Promise<VoiceRecordingResult | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.cleanup();
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
        const duration = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
        const url = URL.createObjectURL(audioBlob);

        // Normalize waveform to 20-30 bars
        let finalWaveform = this.waveformData;
        if (finalWaveform.length === 0) {
          finalWaveform = Array.from({ length: 24 }, () => Math.floor(20 + Math.random() * 60));
        } else if (finalWaveform.length > 30) {
          const step = Math.floor(finalWaveform.length / 28);
          finalWaveform = finalWaveform.filter((_, idx) => idx % step === 0).slice(0, 28);
        }

        this.cleanup();

        resolve({
          url,
          duration,
          waveform: finalWaveform,
          size: audioBlob.size,
        });
      };

      this.mediaRecorder.stop();
    });
  }

  cancelRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.cleanup();
  }

  private cleanup() {
    if (this.waveformInterval) {
      clearInterval(this.waveformInterval);
      this.waveformInterval = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try { this.audioCtx.close(); } catch {}
      this.audioCtx = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }
}

export const voiceRecorder = new VoiceRecorderService();
