/**
 * AURA LUXE - Web Audio Tactile Sound Synthesizer
 * Generates delicate, luxury feedback sounds without external audio assets.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('aura_sound_muted') === 'true';
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('aura_sound_muted', this.muted);
    return this.muted;
  }

  playPop() {
    // Sound disabled per user request
    return;
  }

  playClick() {
    // Sound disabled per user request
    return;
  }

  playSuccess() {
    // Sound disabled per user request
    return;
  }
}

export const sounds = new SoundEngine();
