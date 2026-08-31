/**
 * BANBAN MATGO - Realistic Hwatu Slap & Coin Sound Synthesizer
 * 진짜 화투패를 담요/나무판에 촥! 내리칠 때의 스냅 사운드 및 리얼 코인 사운드
 */

class GoStopAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // 🎴 진짜 실물 화투를 융단에 내리칠 때의 찰진 "촥!" 타격음 (Real Card Slap)
  playCardSlap(intensity = 1.0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. 카드가 맞닿는 날카로운 플라스틱 스냅 (Snap Click)
      const snapLen = this.ctx.sampleRate * 0.03;
      const snapBuffer = this.ctx.createBuffer(1, snapLen, this.ctx.sampleRate);
      const snapData = snapBuffer.getChannelData(0);
      for (let i = 0; i < snapLen; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapLen * 0.15));
      }
      const snapSource = this.ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      const snapFilter = this.ctx.createBiquadFilter();
      snapFilter.type = 'highpass';
      snapFilter.frequency.setValueAtTime(2200, now);

      const snapGain = this.ctx.createGain();
      snapGain.gain.setValueAtTime(0.6 * intensity, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapSource.start(now);

      // 2. 바닥을 때리는 묵직한 타격 바디감 (Slap Thud)
      const slapLen = this.ctx.sampleRate * 0.07;
      const slapBuffer = this.ctx.createBuffer(1, slapLen, this.ctx.sampleRate);
      const slapData = slapBuffer.getChannelData(0);
      for (let i = 0; i < slapLen; i++) {
        slapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (slapLen * 0.25));
      }
      const slapSource = this.ctx.createBufferSource();
      slapSource.buffer = slapBuffer;

      const slapFilter = this.ctx.createBiquadFilter();
      slapFilter.type = 'bandpass';
      slapFilter.frequency.setValueAtTime(850, now);
      slapFilter.Q.setValueAtTime(2.0, now);

      const slapGain = this.ctx.createGain();
      slapGain.gain.setValueAtTime(0.7 * intensity, now);
      slapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      slapSource.connect(slapFilter);
      slapFilter.connect(slapGain);
      slapGain.connect(this.ctx.destination);
      slapSource.start(now);

      // 3. 융단 울림 톤 (Felt Resonance)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.06);

      oscGain.gain.setValueAtTime(0.5 * intensity, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // 💰 돈 짤랑거리는 동전 소리 (Coin Clink)
  playCoin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [1800, 2400, 3200, 4200];
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }, idx * 45);
    });
  }

  // 패를 가져올 때 솨라락 (Slide Collect)
  playCardCollect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 🐶 반반이 멍멍! 효과음
  playBark() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(820, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.14);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // 특수 룰 효과음 (뻑, 쪽, 따닥, 쓸)
  playSpecial(type) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'bbuck') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.3);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      this.playCoin();
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 고! 선언
  playGo() {
    this.playTone(659.25, 'triangle', 0.15, 0.3);
    setTimeout(() => this.playTone(1046.5, 'square', 0.25, 0.4), 100);
  }

  // 스톱! 승리
  playStop() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.2, 0.25), idx * 65);
    });
    setTimeout(() => this.playCoin(), 350);
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }
}

window.goStopAudio = new GoStopAudio();
