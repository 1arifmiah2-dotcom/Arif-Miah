/**
 * Web Audio API synthesizer for Aura Messenger
 * Provides realistic telephone ringers, message pops, incoming call rings,
 * and call tones with zero external audio assets.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ringOscillator1: OscillatorNode | null = null;
  private ringOscillator2: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private isRinging: boolean = false;
  private ringInterval: number | null = null;

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'suspended') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    return this.ctx;
  }

  // Play a quick crisp pop when a message is sent
  playMessageSent() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio autoplay may be restricted until first user interaction
    }
  }

  // Play a sweet dual-chime when a message arrives
  playMessageReceived() {
    try {
      const ctx = this.getAudioContext();
      
      const playChime = (freq: number, startDelay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + startDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + 0.25);
      };

      playChime(659.25, 0); // E5
      playChime(987.77, 0.1); // B5
    } catch {
      // AudioContext handling
    }
  }

  // Play telephone ringback tone (when you call someone)
  startRingback() {
    this.stopCallSounds();
    this.isRinging = true;

    const playToneBurst = () => {
      if (!this.isRinging) return;
      try {
        const ctx = this.getAudioContext();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // US standard 440Hz + 480Hz dial/ringback tone
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(480, ctx.currentTime);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.3);
        osc2.stop(ctx.currentTime + 1.3);
      } catch {
        // Audio error handling
      }
    };

    playToneBurst();
    this.ringInterval = window.setInterval(playToneBurst, 3200);
  }

  // Play melodic mobile ringtone (when receiving a call)
  startIncomingRingtone() {
    this.stopCallSounds();
    this.isRinging = true;

    const notes = [
      { f: 587.33, d: 0.15 }, // D5
      { f: 659.25, d: 0.15 }, // E5
      { f: 880.00, d: 0.3 },  // A5
      { f: 783.99, d: 0.3 },  // G5
    ];

    const playMelody = () => {
      if (!this.isRinging) return;
      try {
        const ctx = this.getAudioContext();
        let timeOffset = 0;

        notes.forEach(({ f, d }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + timeOffset);

          gain.gain.setValueAtTime(0.2, ctx.currentTime + timeOffset);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + d);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + timeOffset);
          osc.stop(ctx.currentTime + timeOffset + d);

          timeOffset += d + 0.05;
        });
      } catch {
        // Ringtone handling
      }
    };

    playMelody();
    this.ringInterval = window.setInterval(playMelody, 2200);
  }

  // Play call connected confirmation chime
  playCallConnected() {
    this.stopCallSounds();
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio error handling
    }
  }

  // Play call ended "bloop bloop"
  playCallEnded() {
    this.stopCallSounds();
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // Audio error handling
    }
  }

  stopCallSounds() {
    this.isRinging = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
    if (this.ringOscillator1) {
      try { this.ringOscillator1.stop(); } catch {}
      this.ringOscillator1 = null;
    }
    if (this.ringOscillator2) {
      try { this.ringOscillator2.stop(); } catch {}
      this.ringOscillator2 = null;
    }
  }
}

export const soundEffects = new SoundSynthesizer();
