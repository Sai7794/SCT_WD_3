(function() {
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function createOscillator(type, freq, duration, gainStart, gainEnd, detune = 0) {
    if (isMuted) return;
    initAudio();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (detune) {
      osc.detune.setValueAtTime(detune, audioCtx.currentTime);
    }

    gainNode.gain.setValueAtTime(gainStart, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(gainEnd, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  const QuizSound = {
    setMuted(muted) {
      isMuted = muted;
    },

    getMuted() {
      return isMuted;
    },

    playClick() {
      try {
        initAudio();
        if (isMuted) return;
        const time = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, time);
        osc.frequency.exponentialRampToValueAtTime(150, time + 0.08);

        gainNode.gain.setValueAtTime(0.1, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.08);
      } catch (e) {
        console.error("Audio error", e);
      }
    },

    playCorrect() {
      try {
        initAudio();
        if (isMuted) return;
        const time = audioCtx.currentTime;
        
        // Play three rising notes in a cheerful arpeggio (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const noteDur = 0.08;
        const spacing = 0.07;

        notes.forEach((freq, idx) => {
          const startTime = time + idx * spacing;
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gainNode.gain.setValueAtTime(0.15, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDur * 2);

          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc.start(startTime);
          osc.stop(startTime + noteDur * 2);
        });
      } catch (e) {
        console.error("Audio error", e);
      }
    },

    playIncorrect() {
      try {
        initAudio();
        if (isMuted) return;
        const time = audioCtx.currentTime;
        
        // Lower, dissonant buzz using two detuned sawtooth waves
        const dur = 0.35;
        const freq = 120;

        [0, 6].forEach((detune) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, time);
          osc.detune.setValueAtTime(detune, time);

          // Add a lowpass filter to make the buzz less harsh
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, time);

          gainNode.gain.setValueAtTime(0.1, time);
          gainNode.gain.linearRampToValueAtTime(0.001, time + dur);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc.start(time);
          osc.stop(time + dur);
        });
      } catch (e) {
        console.error("Audio error", e);
      }
    },

    playTimerTick() {
      try {
        initAudio();
        if (isMuted) return;
        const time = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, time);

        gainNode.gain.setValueAtTime(0.04, time);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.03);
      } catch (e) {
        console.error("Audio error", e);
      }
    },

    playVictory() {
      try {
        initAudio();
        if (isMuted) return;
        const time = audioCtx.currentTime;
        
        // Major chord sequence: C4, E4, G4, C5, E5, G5, C6
        const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        const tempo = 0.08;

        arpeggio.forEach((freq, idx) => {
          const startTime = time + idx * tempo;
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          // Prolong the final note
          const dur = idx === arpeggio.length - 1 ? 0.8 : 0.25;

          gainNode.gain.setValueAtTime(0.15, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc.start(startTime);
          osc.stop(startTime + dur);
        });
      } catch (e) {
        console.error("Audio error", e);
      }
    }
  };

  window.QuizSound = QuizSound;
})();
