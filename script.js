// Music data
const songs = [
  {
    id: 1,
    name: "Sreehari - A parody of Urvasi Ft. Sreehari",
    artist: "Arjun Liji",
    url: "music/sreehari/audio.mp3",
    cover: "music/sreehari/cover.png",
    date: "2024-04-25",
    description: `Sreehari, A parody of Urvasi by AR Rahuman. 
    Made in FL Studio. 
    This has nothing to do with my friend Sreehari who is a hot individual who gets laid very often...<br /><br /><br />
    [Lyrics]<br /> <br />
    ഓ! ഹരീ, ഓ! ഹരീ -- <br />
    Take it easy Sreehari... <br />
    പന്ത് പോലെ വയറ് ഉള്ള- <br />
    കിടുക്കൻ ചെറുക്കൻ ശ്രീഹരി! <br />
    <br /><br />
    ഓ! ഹരീ, ഓ! ഹരീ -- <br />
    Take it easy Sreehari... <br />
    പന്ത് പോലെ വയറ് ഉള്ള- <br />
    കിടുക്കൻ ചെറുക്കൻ ശ്രീഹരി! <br />
    <br /><br />
    കാഴ്ച്ചയിൽ, പ്രശ്നം ആ... <br />
    (Hes so naughty sreehari) <br />
    കൈ വിടാതെ കാത്തുകൊള്ളും- <br />
    (അവനാ നമ്മുടെ ശ്രീഹരി) <br />
    <br /><br />
    കാണും നീ ഹരിയെ ഹരിയെ, <br />
    വയറ് നിറച്ചവനങ്ങ് തിന്നും! <br />
    പിന്നെയാ വഴിയെ വഴിയെ, <br />
    കഴിക്കാൻ ഒന്നും കിട്ടില്ല മോനേ! <br />
    <br /><br />
    അവനതും തിന്നു തീർക്കും! <br />
    (Hes so naughty sreehari) <br />
    അവനെപ്പോലെ ആരുമില്ല! <br />
    (അവനാ നമ്മുടെ ശ്രീഹരി) <br />
    <br /><br />
    ഓ! ഹരീ, ഓ! ഹരീ -- <br />
    Take it easy Sreehari... <br />
    `,
  },
  {
    id: 2,
    name: "Superman",
    artist: "Arjun Liji",
    url: "music/superman/audio.mp3",
    cover: "music/superman/cover.png",
    date: "2024-02-20",
    description: "This was me practicing my guitar for the first time on fl studio. I tried to make it sound as close as possible to the real one, but didnt knew much about music theory at that time...",
  },
  {
    id: 3,
    name: "Better off together",
    artist: "Arjun Liji",
    url: "music/together/audio.mp3",
    cover: "music/together/cover.jpg",
    date: "2024-02-20",
    description: "My first try on recreation of a song using FL studio. <br/>Original song: Better of alone",
  },
];

let currentSongIndex = 0;
let isPlaying = false;
let isLooping = false;
let audio = new Audio();
let eventListenersInitialized = false;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Load last played song from localStorage
  const savedSongIndex = localStorage.getItem("lastPlayedSong");
  if (savedSongIndex !== null) {
    currentSongIndex = parseInt(savedSongIndex);
  }
  
  initAudioEventListeners();
  loadSong(currentSongIndex);
  renderLibrary();
  updateUI();
  setupMobilePlayer();
});

// SVG Icons
const ICONS = {
  play: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  pause: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
  playLarge: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  pauseLarge: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
  prev: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>`,
  next: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>`,
  loop: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`,
  chevronDown: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`,
  playCard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`
};

// Render song library
function renderLibrary() {
  const songList = document.getElementById("songList");
  if (!songList) return;

  songList.innerHTML = songs
    .map(
      (song, index) => `
    <div class="song-card" onclick="playSong(${index})">
      <div class="song-card-image">
        <img src="${song.cover}" alt="${song.name}" />
        <div class="song-card-overlay">
          <button class="play-button" onclick="event.stopPropagation(); playSong(${index})">${ICONS.playCard}</button>
        </div>
      </div>
      <div class="song-card-info">
        <div class="song-card-title">${song.name}</div>
        <div class="song-card-artist">${song.artist}</div>
        ${currentSongIndex === index ? '<span class="on-track-indicator">PLAYING</span>' : ''}
      </div>
    </div>
  `,
    )
    .join("");
}

function playSong(index) {
  loadSong(index);
  // Force play the song
  isPlaying = false;
  play();
  renderLibrary();
}

function loadSong(index) {
  if (index < 0 || index >= songs.length) return;

  currentSongIndex = index;

  localStorage.setItem("lastPlayedSong", index);
  
  const song = songs[index];

  audio.src = song.url;
  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;

  document.getElementById("trackNameLarge").textContent = song.name;
  document.getElementById("trackArtistLarge").textContent = song.artist;
  document.getElementById("trackDescription").innerHTML = song.description || "No description here";
  
  if (song.date) {
    const dateObj = new Date(song.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    document.getElementById("trackDate").textContent = formattedDate;
  } else {
    document.getElementById("trackDate").textContent = "N/A";
  }
  
  const trackCoverLarge = document.getElementById("trackCoverLarge");
  if (trackCoverLarge) {
    trackCoverLarge.src = song.cover;
    trackCoverLarge.onerror = function () {
      this.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23333' width='64' height='64'/%3E%3Ctext x='32' y='32' font-size='12' fill='%23666' text-anchor='middle' dominant-baseline='central'%3ENo Cover%3C/text%3E%3C/svg%3E";
    };
  }

  // Check if text needs marquee animation
  updateSongTextMarquee();
  
  // Update bottom bar cover image
  const bottomImg = document.getElementById("bottomImg");
  if (bottomImg) {
    bottomImg.src = song.cover;
    bottomImg.onerror = function () {
      this.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23333' width='64' height='64'/%3E%3Ctext x='32' y='32' font-size='12' fill='%23666' text-anchor='middle' dominant-baseline='central'%3ENo Cover%3C/text%3E%3C/svg%3E";
    };
  }
  
  // Also update mobile player cover if exists
  const mobilePlayerCover = document.getElementById("mobilePlayerCover");
  if (mobilePlayerCover) {
    mobilePlayerCover.src = song.cover;
  }
  
  // Update mobile player content
  updateMobilePlayerContent();
}

// Update marquee animation based on text width
function updateSongTextMarquee() {
  const textContent = document.getElementById("songTextContent");
  const songNameEl = document.getElementById("songName");
  
  if (!textContent || !songNameEl) return;
  
  // Remove scrolling class first
  textContent.classList.remove("scrolling");
  
  // Use requestAnimationFrame to ensure DOM is updated
  requestAnimationFrame(() => {
    const textWidth = songNameEl.scrollWidth;
    const containerWidth = 250; // matches song-text-wrapper width
    
    if (textWidth > containerWidth) {
      textContent.classList.add("scrolling");
    }
  });
}

// Play/Pause
function play() {
  if (audio.src === "") {
    loadSong(currentSongIndex);
  }

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }

  updatePlayButton();
  
  // Update track status
  const statusEl = document.getElementById("trackStatus");
  if (statusEl) {
    statusEl.textContent = isPlaying ? "Playing" : "Paused";
  }
}

// Next song
function next() {
  if (isLooping) {
    // If looping, restart the current song
    audio.currentTime = 0;
    if (isPlaying) {
      audio.play();
    }
  } else {
    // Otherwise go to next song
    const nextIndex = (currentSongIndex + 1) % songs.length;
    loadSong(nextIndex);
    renderLibrary();
    if (isPlaying) {
      audio.play();
    }
  }
}

// Previous song
function prev() {
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex);
  renderLibrary();
  
  if (isPlaying) {
    audio.play();
  }
}

// Initialize audio event listeners (called once)
function initAudioEventListeners() {
  if (eventListenersInitialized) return;
  eventListenersInitialized = true;
  
  const progressBar = document.getElementById("progressBar");
  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl = document.getElementById("totalTime");

  // Update on time change
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 1000;
    if (progressBar) {
      progressBar.value = progress;
      progressBar.style.setProperty("--value", (progress / 1000 * 100) + "%");
    }
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
    
    // Update mobile player progress
    const mobileProgress = document.getElementById("mobileProgressBar");
    if (mobileProgress) {
      mobileProgress.value = progress;
      mobileProgress.style.setProperty("--value", (progress / 1000 * 100) + "%");
    }
    const mobileCurrentTime = document.getElementById("mobileCurrentTime");
    if (mobileCurrentTime) {
      mobileCurrentTime.textContent = formatTime(audio.currentTime);
    }
    
    // Update track status in panel
    const statusEl = document.getElementById("trackStatus");
    if (statusEl) {
      statusEl.textContent = isPlaying ? "Playing" : "Paused";
    }
    
    // Update mobile status
    const mobileStatus = document.getElementById("mobileStatus");
    if (mobileStatus) {
      mobileStatus.textContent = isPlaying ? "Playing" : "Paused";
    }
  });

  // Update total duration when metadata loads
  audio.addEventListener("loadedmetadata", () => {
    if (totalTimeEl) {
      totalTimeEl.textContent = formatTime(audio.duration);
    }
    const durationEl = document.getElementById("trackDuration");
    if (durationEl) {
      durationEl.textContent = formatTime(audio.duration);
    }
    const mobileTotalTime = document.getElementById("mobileTotalTime");
    if (mobileTotalTime) {
      mobileTotalTime.textContent = formatTime(audio.duration);
    }
    // Update mobile duration
    const mobileDuration = document.getElementById("mobileDuration");
    if (mobileDuration) {
      mobileDuration.textContent = formatTime(audio.duration);
    }
  });

  // Handle progress bar input
  if (progressBar) {
    progressBar.addEventListener("input", (e) => {
      const newTime = (e.target.value / 1000) * audio.duration;
      audio.currentTime = newTime;
      e.target.style.setProperty("--value", (e.target.value / 1000 * 100) + "%");
    });
  }

  // Auto play next song when current ends
  audio.addEventListener("ended", () => {
    if (isLooping) {
      audio.currentTime = 0;
      audio.play();
    } else {
      // Move to next song
      const nextIndex = (currentSongIndex + 1) % songs.length;
      loadSong(nextIndex);
      renderLibrary();
      audio.play();
    }
  });
}

// Update progress bar UI only (no event listeners)
function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  if (progressBar && audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 1000;
    progressBar.value = progress;
    progressBar.style.setProperty("--value", (progress / 1000 * 100) + "%");
  }
}

// Format time
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Volume control
const volumeControl = document.getElementById("volume");
if (volumeControl) {
  volumeControl.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
  });
  audio.volume = 0.5;
  volumeControl.value = 100;
}

// Update UI
function updateUI() {
  updatePlayButton();
  updateProgressBar();
}

// Toggle loop mode
function toggleLoop() {
  isLooping = !isLooping;
  const loopBtn = document.getElementById("loopBtn");
  const mobileLoopBtn = document.getElementById("mobileLoopBtn");
  if (loopBtn) {
    loopBtn.classList.toggle("active", isLooping);
  }
  if (mobileLoopBtn) {
    mobileLoopBtn.classList.toggle("active", isLooping);
  }
}

// Setup mobile player
function setupMobilePlayer() {
  // Create mobile player modal with all sidebar info
  const mobilePlayerHTML = `
    <div id="mobilePlayer" class="mobile-player">
      <div class="mobile-player-header">
        <button id="closeMobilePlayer" class="mobile-close-btn" aria-label="Close">${ICONS.chevronDown}</button>
        <span class="mobile-header-title">Now Playing</span>
        <div style="width: 40px;"></div>
      </div>
      <div class="mobile-player-content">
        <img id="mobilePlayerCover" src="" alt="cover" class="mobile-cover" />
        <div class="mobile-track-info">
          <h2 id="mobileTrackName" class="mobile-track-name">Track Name</h2>
          <p id="mobileTrackArtist" class="mobile-track-artist">Artist</p>
        </div>
        <div class="mobile-progress-container">
          <span id="mobileCurrentTime" class="mobile-time">0:00</span>
          <input type="range" id="mobileProgressBar" class="mobile-progress-bar" min="0" max="1000" value="0" />
          <span id="mobileTotalTime" class="mobile-time">0:00</span>
        </div>
        <div class="mobile-controls">
          <button id="mobileLoopBtn" class="mobile-control-btn" onclick="toggleLoop()" aria-label="Loop">${ICONS.loop}</button>
          <button class="mobile-control-btn" onclick="prev()" aria-label="Previous">${ICONS.prev}</button>
          <button id="mobilePlayBtn" class="mobile-play-btn" onclick="play()" aria-label="Play">${ICONS.playLarge}</button>
          <button class="mobile-control-btn" onclick="next()" aria-label="Next">${ICONS.next}</button>
          <div style="width: 40px;"></div>
        </div>
        <!-- Track Additional Info (same as sidebar) -->
        <div class="mobile-additional-info">
          <div class="mobile-info-row">
            <div class="mobile-info-item">
              <span class="mobile-info-label">Duration</span>
              <span id="mobileDuration" class="mobile-info-value">0:00</span>
            </div>
            <div class="mobile-info-item">
              <span class="mobile-info-label">Status</span>
              <span id="mobileStatus" class="mobile-info-value">Idle</span>
            </div>
          </div>
          <div class="mobile-info-item">
            <span class="mobile-info-label">Release Date</span>
            <span id="mobileDate" class="mobile-info-value">N/A</span>
          </div>
        </div>
        <!-- Track Description -->
        <div class="mobile-description-section">
          <h4 class="mobile-description-title">About This Track</h4>
          <p id="mobileDescription" class="mobile-description-text">No description yet...</p>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', mobilePlayerHTML);
  
  // Add click listener to bottom bar (song info area) to open mobile player
  const bottomBar = document.querySelector('.song-info-container');
  if (bottomBar) {
    bottomBar.addEventListener('click', (e) => {
      // Only open on mobile
      if (window.innerWidth <= 640) {
        openMobilePlayer();
      }
    });
  }
  
  // Close mobile player
  const closeBtn = document.getElementById('closeMobilePlayer');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobilePlayer);
  }
  
  // Mobile progress bar input
  const mobileProgressBar = document.getElementById('mobileProgressBar');
  if (mobileProgressBar) {
    mobileProgressBar.addEventListener('input', (e) => {
      const newTime = (e.target.value / 1000) * audio.duration;
      audio.currentTime = newTime;
      e.target.style.setProperty("--value", (e.target.value / 1000 * 100) + "%");
      // Sync main progress bar
      const progressBar = document.getElementById("progressBar");
      if (progressBar) {
        progressBar.value = e.target.value;
        progressBar.style.setProperty("--value", (e.target.value / 1000 * 100) + "%");
      }
    });
  }
  
  // Add swipe down to close gesture
  let touchStartY = 0;
  let touchEndY = 0;
  const mobilePlayerEl = document.getElementById('mobilePlayer');
  
  if (mobilePlayerEl) {
    mobilePlayerEl.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    mobilePlayerEl.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].screenY;
      const swipeDistance = touchEndY - touchStartY;
      
      // If swiped down more than 100px, close the player
      if (swipeDistance > 100) {
        closeMobilePlayer();
      }
    }, { passive: true });
  }
}

function openMobilePlayer() {
  const mobilePlayer = document.getElementById('mobilePlayer');
  if (mobilePlayer) {
    // Update mobile player content
    const song = songs[currentSongIndex];
    document.getElementById('mobilePlayerCover').src = song.cover;
    document.getElementById('mobileTrackName').textContent = song.name;
    document.getElementById('mobileTrackArtist').textContent = song.artist;
    document.getElementById('mobileCurrentTime').textContent = formatTime(audio.currentTime);
    document.getElementById('mobileTotalTime').textContent = formatTime(audio.duration);
    
    // Update additional info (same as sidebar)
    const mobileDuration = document.getElementById('mobileDuration');
    if (mobileDuration) {
      mobileDuration.textContent = formatTime(audio.duration);
    }
    
    const mobileStatus = document.getElementById('mobileStatus');
    if (mobileStatus) {
      mobileStatus.textContent = isPlaying ? 'Playing' : 'Paused';
    }
    
    const mobileDate = document.getElementById('mobileDate');
    if (mobileDate && song.date) {
      const dateObj = new Date(song.date);
      const formattedDate = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      mobileDate.textContent = formattedDate;
    } else if (mobileDate) {
      mobileDate.textContent = 'N/A';
    }
    
    const mobileDescription = document.getElementById('mobileDescription');
    if (mobileDescription) {
      mobileDescription.innerHTML = song.description || 'No description available';
    }
    
    // Sync progress
    const progress = audio.duration ? (audio.currentTime / audio.duration) * 1000 : 0;
    const mobileProgressBar = document.getElementById('mobileProgressBar');
    if (mobileProgressBar) {
      mobileProgressBar.value = progress;
      mobileProgressBar.style.setProperty("--value", (progress / 1000 * 100) + "%");
    }
    
    // Update play button with SVG
    const mobilePlayBtn = document.getElementById('mobilePlayBtn');
    if (mobilePlayBtn) {
      mobilePlayBtn.innerHTML = isPlaying ? ICONS.pauseLarge : ICONS.playLarge;
    }
    
    // Update loop button
    const mobileLoopBtn = document.getElementById('mobileLoopBtn');
    if (mobileLoopBtn) {
      mobileLoopBtn.classList.toggle('active', isLooping);
    }
    
    mobilePlayer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobilePlayer() {
  const mobilePlayer = document.getElementById('mobilePlayer');
  if (mobilePlayer) {
    mobilePlayer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Update play button (both main and mobile)
function updatePlayButton() {
  // Update main play button
  const mainPlayBtn = document.getElementById('mainPlayBtn');
  if (mainPlayBtn) {
    const playIcon = mainPlayBtn.querySelector('.play-icon');
    const pauseIcon = mainPlayBtn.querySelector('.pause-icon');
    if (playIcon && pauseIcon) {
      if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
      } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
      }
    }
  }
  
  // Update mobile play button
  const mobilePlayBtn = document.getElementById('mobilePlayBtn');
  if (mobilePlayBtn) {
    mobilePlayBtn.innerHTML = isPlaying ? ICONS.pauseLarge : ICONS.playLarge;
  }
}

// Update mobile player content when song changes
function updateMobilePlayerContent() {
  const mobilePlayer = document.getElementById('mobilePlayer');
  if (!mobilePlayer) return;
  
  const song = songs[currentSongIndex];
  const coverEl = document.getElementById('mobilePlayerCover');
  const nameEl = document.getElementById('mobileTrackName');
  const artistEl = document.getElementById('mobileTrackArtist');
  
  if (coverEl) coverEl.src = song.cover;
  if (nameEl) nameEl.textContent = song.name;
  if (artistEl) artistEl.textContent = song.artist;
  
  // Update additional info
  const mobileDate = document.getElementById('mobileDate');
  if (mobileDate && song.date) {
    const dateObj = new Date(song.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    mobileDate.textContent = formattedDate;
  } else if (mobileDate) {
    mobileDate.textContent = 'N/A';
  }
  
  const mobileDescription = document.getElementById('mobileDescription');
  if (mobileDescription) {
    mobileDescription.innerHTML = song.description || 'No description available';
  }
}