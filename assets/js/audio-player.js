/**
 * TRiSTAR - LUXURY AUDIO PLAYER & WEB AUDIO ENGINE
 * Supports real audio playback for "Blessings" (blessed.wav) with live Web Audio Analyser Equalizer,
 * and procedural fallback engine for catalog previews.
 */

(function() {
  'use strict';

  // Playlist catalog
  const TRACKS = [
    {
      id: 1,
      title: "Blessings (Official Single)",
      artist: "TRiSTAR",
      album: "Blessings - Single",
      producer: "HOLLYWOOD",
      year: "2026",
      cover: "assets/images/blessings_cover.jpg",
      audioSrc: "assets/audio/blessed.wav",
      duration: "1:15",
      bpm: 88,
      key: "F minor",
      scale: [174.61, 207.65, 233.08, 261.63, 311.13, 349.23, 415.30]
    },
    {
      id: 2,
      title: "PSG4L Anthem (RIP SLO)",
      artist: "TRiSTAR",
      album: "PSG4L vol.1 RIP SLO",
      producer: "PSG4L Presents",
      year: "2025",
      cover: "assets/images/psg4l_logo.jpg",
      duration: "3:18",
      bpm: 94,
      key: "G minor",
      scale: [196.00, 220.00, 233.08, 261.63, 293.66, 311.13, 349.23]
    },
    {
      id: 3,
      title: "Renaissance Man",
      artist: "TRiSTAR",
      album: "Renaissance Man",
      producer: "Eric TRiSTAR McKinney",
      year: "2024",
      cover: "assets/images/tristar_hero.jpg",
      duration: "4:05",
      bpm: 84,
      key: "C minor",
      scale: [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13]
    },
    {
      id: 4,
      title: "Oh My God (feat. Roscoe)",
      artist: "TRiSTAR ft. Roscoe",
      album: "Know Thyself: Stolen Legacy",
      producer: "J. Wells",
      year: "Soundtrack",
      cover: "assets/images/tristar_la_sunset.jpg",
      duration: "3:30",
      bpm: 96,
      key: "D minor",
      scale: [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23]
    },
    {
      id: 5,
      title: "Act A Fool",
      artist: "TRiSTAR",
      album: "Act A Fool - Single",
      producer: "PSG4L Records",
      year: "2018",
      cover: "assets/images/tristar_live.jpg",
      duration: "3:12",
      bpm: 92,
      key: "E minor",
      scale: [164.81, 196.00, 220.00, 246.94, 293.66, 329.63, 392.00]
    },
    {
      id: 6,
      title: "Rah Rah (feat. Royal skye)",
      artist: "TRiSTAR ft. Royal skye",
      album: "Rah Rah - Single",
      producer: "PSG4L Presents Productions",
      year: "2021",
      cover: "assets/images/tristar_studio.jpg",
      duration: "3:24",
      bpm: 90,
      key: "A minor",
      scale: [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00]
    }
  ];

  let currentTrackIdx = 0;
  let isPlaying = false;
  let audioCtx = null;
  let analyser = null;
  let masterGain = null;
  let mediaSource = null;
  let audioElement = null;
  let beatTimer = null;
  let step = 0;
  let currentTime = 0;
  let progressInterval = null;

  // DOM Elements
  const playBtn = document.getElementById('player-play-btn');
  const prevBtn = document.getElementById('player-prev-btn');
  const nextBtn = document.getElementById('player-next-btn');
  const trackTitle = document.getElementById('player-track-title');
  const trackArtist = document.getElementById('player-track-artist');
  const trackThumb = document.getElementById('player-track-thumb');
  const progressFill = document.getElementById('player-progress-fill');
  const progressTrack = document.getElementById('player-progress-track');
  const curTimeEl = document.getElementById('player-cur-time');
  const durTimeEl = document.getElementById('player-dur-time');
  const volumeSlider = document.getElementById('player-volume');
  const visualizerCanvas = document.getElementById('player-visualizer');

  // Initialize Web Audio Context & Audio Tag
  function initAudio() {
    if (!audioElement) {
      audioElement = new Audio();
      audioElement.crossOrigin = "anonymous";
      audioElement.preload = "auto";
      audioElement.addEventListener('ended', window.nextTrack);
      audioElement.addEventListener('timeupdate', () => {
        if (TRACKS[currentTrackIdx].audioSrc && audioElement.duration) {
          const cur = audioElement.currentTime;
          const dur = audioElement.duration;
          const mins = Math.floor(cur / 60);
          const secs = Math.floor(cur % 60).toString().padStart(2, '0');
          if (curTimeEl) curTimeEl.textContent = `${mins}:${secs}`;
          const durMins = Math.floor(dur / 60);
          const durSecs = Math.floor(dur % 60).toString().padStart(2, '0');
          if (durTimeEl) durTimeEl.textContent = `${durMins}:${durSecs}`;
          if (progressFill) progressFill.style.width = `${(cur / dur) * 100}%`;
        }
      });
    }

    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      masterGain = audioCtx.createGain();
      masterGain.gain.value = volumeSlider ? parseFloat(volumeSlider.value) : 0.7;

      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);

      try {
        mediaSource = audioCtx.createMediaElementSource(audioElement);
        mediaSource.connect(masterGain);
      } catch (e) {
        console.log("Media source connected or direct mode");
      }

      startVisualizer();
    }
  }

  // Synthesize West Coast Hip-Hop Instrument Hits (fallback)
  function playKick(time) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.28);
    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.35);
  }

  function playSnare(time) {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, time);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    noise.start(time);
    noise.stop(time + 0.18);
  }

  function playHiHat(time, open = false) {
    if (!audioCtx) return;
    const dur = open ? 0.22 : 0.05;
    const bufferSize = audioCtx.sampleRate * dur;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    noise.start(time);
    noise.stop(time + dur);
  }

  function playRhodesNote(freq, time, dur = 0.4) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + dur);
  }

  // Sequencer loop for catalog preview tracks
  function stepSequencer() {
    if (!isPlaying || !audioCtx || TRACKS[currentTrackIdx].audioSrc) return;

    const track = TRACKS[currentTrackIdx];
    const now = audioCtx.currentTime;
    const scale = track.scale;
    const s16 = step % 16;

    if (s16 === 0 || s16 === 7 || s16 === 10) playKick(now);
    if (s16 === 4 || s16 === 12) playSnare(now);
    if (s16 % 2 === 0 || (s16 % 4 === 3 && Math.random() > 0.4)) playHiHat(now, s16 === 14);

    if (s16 === 0 || s16 === 6 || s16 === 12) {
      const baseNote = scale[s16 === 0 ? 0 : (s16 === 6 ? 2 : 4)];
      playRhodesNote(baseNote, now, 0.7);
      playRhodesNote(baseNote * 1.5, now + 0.05, 0.6);
    }

    if (s16 === 3 || s16 === 9 || s16 === 15) {
      const melodyNote = scale[Math.floor(Math.random() * scale.length)] * 2;
      playRhodesNote(melodyNote, now, 0.35);
    }

    step++;
    const stepDuration = (60 / track.bpm) / 4 * 1000;
    beatTimer = setTimeout(stepSequencer, stepDuration);
  }

  // Update Player UI
  function updateUI() {
    const track = TRACKS[currentTrackIdx];
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = `${track.artist} • ${track.album}`;
    if (trackThumb) trackThumb.src = track.cover;
    if (durTimeEl) durTimeEl.textContent = track.duration;

    if (playBtn) {
      playBtn.innerHTML = isPlaying 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    }

    // Sync active track rows
    document.querySelectorAll('.track-row').forEach(row => {
      const rowId = parseInt(row.getAttribute('data-track-id'), 10);
      if (rowId === track.id) {
        row.classList.add('playing');
        const icon = row.querySelector('.track-play-icon');
        if (icon) {
          icon.innerHTML = isPlaying
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
            : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        }
      } else {
        row.classList.remove('playing');
        const icon = row.querySelector('.track-play-icon');
        if (icon) {
          icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        }
      }
    });
  }

  // Play / Pause toggle
  window.togglePlay = function(trackId = null) {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (trackId !== null) {
      const idx = TRACKS.findIndex(t => t.id === trackId);
      if (idx !== -1) {
        if (currentTrackIdx === idx && isPlaying) {
          pauseTrack();
          return;
        }
        currentTrackIdx = idx;
        step = 0;
        currentTime = 0;
      }
    }

    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  function playTrack() {
    isPlaying = true;
    const track = TRACKS[currentTrackIdx];
    updateUI();

    if (track.audioSrc && audioElement) {
      if (audioElement.src !== window.location.origin + '/' + track.audioSrc && !audioElement.src.endsWith(track.audioSrc)) {
        audioElement.src = track.audioSrc;
      }
      audioElement.play().catch(e => console.log("Audio play allowed on user interaction:", e));
    } else {
      if (audioElement) audioElement.pause();
      stepSequencer();

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = setInterval(() => {
        currentTime += 1;
        const mins = Math.floor(currentTime / 60);
        const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
        if (curTimeEl) curTimeEl.textContent = `${mins}:${secs}`;
        if (progressFill) {
          const pct = Math.min((currentTime / 220) * 100, 100);
          progressFill.style.width = `${pct}%`;
        }
      }, 1000);
    }

    if (window.showToast) {
      window.showToast(`Now Playing: ${track.title}`);
    }
  }

  function pauseTrack() {
    isPlaying = false;
    if (audioElement) audioElement.pause();
    if (beatTimer) clearTimeout(beatTimer);
    if (progressInterval) clearInterval(progressInterval);
    updateUI();
  }

  // Next / Prev track
  window.nextTrack = function() {
    currentTrackIdx = (currentTrackIdx + 1) % TRACKS.length;
    step = 0;
    currentTime = 0;
    if (isPlaying) {
      pauseTrack();
      playTrack();
    } else {
      updateUI();
    }
  };

  window.prevTrack = function() {
    currentTrackIdx = (currentTrackIdx - 1 + TRACKS.length) % TRACKS.length;
    step = 0;
    currentTime = 0;
    if (isPlaying) {
      pauseTrack();
      playTrack();
    } else {
      updateUI();
    }
  };

  // Visualizer renderer
  function startVisualizer() {
    if (!visualizerCanvas || !analyser) return;
    const vCtx = visualizerCanvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function renderBars() {
      requestAnimationFrame(renderBars);
      analyser.getByteFrequencyData(dataArray);

      vCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

      const barWidth = (visualizerCanvas.width / 16) - 2;
      let x = 0;

      for (let i = 0; i < 16; i++) {
        let barHeight = (dataArray[i * 2] / 255) * visualizerCanvas.height;
        if (!isPlaying) {
          barHeight = 3 + Math.sin(Date.now() * 0.003 + i) * 2;
        }

        const grad = vCtx.createLinearGradient(0, visualizerCanvas.height, 0, 0);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.7, '#ffffff');
        grad.addColorStop(1, '#f59e0b');

        vCtx.fillStyle = grad;
        vCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }
    }

    renderBars();
  }

  // Setup Event Listeners
  if (playBtn) playBtn.addEventListener('click', () => window.togglePlay());
  if (nextBtn) nextBtn.addEventListener('click', window.nextTrack);
  if (prevBtn) prevBtn.addEventListener('click', window.prevTrack);

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      if (masterGain) masterGain.gain.value = vol;
      if (audioElement) audioElement.volume = vol;
    });
  }

  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      if (TRACKS[currentTrackIdx].audioSrc && audioElement && audioElement.duration) {
        audioElement.currentTime = pct * audioElement.duration;
      } else {
        currentTime = pct * 220;
        if (progressFill) progressFill.style.width = `${pct * 100}%`;
      }
    });
  }

  // Expose track catalog
  window.TriStarTracks = TRACKS;

  document.addEventListener('DOMContentLoaded', () => {
    updateUI();
  });

})();
