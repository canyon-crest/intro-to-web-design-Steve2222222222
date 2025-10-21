// YouTube IFrame Player API controller (hidden player)
(function () {
  const btn = document.getElementById('audio-toggle');
  const playerContainer = document.getElementById('yt-player');
  if (!btn || !playerContainer) return;

  const VIDEO_ID = '79kpoGF8KWU';
  let ytPlayer = null;
  let ready = false;
  const volumeEl = document.getElementById('volume');
  let pendingVolume = volumeEl ? (parseInt(volumeEl.value, 10) || 50) : 50;

  function loadYouTubeAPI(cb) {
    if (window.YT && window.YT.Player) return cb();
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = cb;
  }

  function createPlayer(playOnReady) {
    ytPlayer = new YT.Player(playerContainer, {
      height: '0', width: '0', videoId: VIDEO_ID,
      playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0, playsinline: 1 },
      events: {
        onReady() {
          ready = true;
          if (volumeEl) { volumeEl.disabled = false; ytPlayer.setVolume(pendingVolume); }
          if (playOnReady) ytPlayer.playVideo();
        },
        onStateChange(e) {
          if (e.data === YT.PlayerState.PLAYING) { btn.textContent = 'Pause ambient audio'; btn.setAttribute('aria-pressed', 'true'); }
          else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) { btn.textContent = 'Play ambient audio'; btn.setAttribute('aria-pressed', 'false'); }
        }
      }
    });
  }

  function togglePlayback() {
    if (!ytPlayer) { loadYouTubeAPI(() => createPlayer(true)); return; }
    if (!ready) return;
    const state = ytPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
  }

  btn.addEventListener('click', togglePlayback);
  if (volumeEl) volumeEl.addEventListener('input', () => { const v = parseInt(volumeEl.value, 10) || 0; pendingVolume = v; if (ytPlayer && ready) ytPlayer.setVolume(v); });
})();
