const songs = [
  {
    id: 1,
    name: "Doberman - Remake of Superman by Eminem",
    artist: "Arjun Liji",
    url: "music/superman/audio.mp3",
    cover: "music/superman/cover.png",
    date: "2024-02-20",
    description: "This was me practicing my guitar for the first time on fl studio. I tried to make it sound as close as possible to the real one, but didnt knew much about music theory at that time...",
  },
  {
    id: 2,
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
    id: 3,
    name: "Better off together - Remake of Better of alone",
    artist: "Arjun Liji",
    url: "music/together/audio.mp3",
    cover: "music/together/cover.jpg",
    date: "2024-02-20",
    description: "My first try on recreation of a song using FL studio. <br/>Original song: Better of alone",
  },
];

// State
let currentIndex = 0;
let isPlaying = false;
let isLooping = false;
const audio = new Audio();

// Init
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("lastSong");
  if (saved) currentIndex = parseInt(saved);
  
  setupAudio();
  loadSong(currentIndex);
  renderLibrary();
});

// Setup audio
function setupAudio() {
  audio.volume = 0.5;
  const vol = $("volume");
  if (vol) {
    vol.value = 100;
    vol.oninput = e => audio.volume = e.target.value / 100;
  }
  
  audio.ontimeupdate = updateProgress;
  audio.onloadedmetadata = updateDuration;
  audio.onended = () => isLooping ? (audio.currentTime = 0, audio.play()) : next();
  
  const prog = $("progress");
  if (prog) prog.oninput = e => {
    audio.currentTime = (e.target.value / 1000) * audio.duration;
    setProgress(e.target.value);
  };
  
  const mProg = $("mProgress");
  if (mProg) mProg.oninput = e => {
    audio.currentTime = (e.target.value / 1000) * audio.duration;
    setProgress(e.target.value);
    setProgress(e.target.value, mProg);
  };
  
  // Swipe down to close
  const mobile = $("mobile");
  let startY = 0;
  mobile?.addEventListener('touchstart', e => startY = e.touches[0].screenY, {passive: true});
  mobile?.addEventListener('touchend', e => {
    if (e.changedTouches[0].screenY - startY > 100) closeMobile();
  }, {passive: true});
}

// Helpers
const $ = id => document.getElementById(id);
const setText = (id, text) => { const el = $(id); if (el) el.textContent = text; };
const setHTML = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };
const setImg = (id, src) => {
  const el = $(id);
  if (!el) return;
  el.src = src;
  el.onerror = () => el.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23333' width='64' height='64'/%3E%3C/svg%3E";
};
const formatTime = s => isNaN(s) ? "0:00" : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const setProgress = (val, el = $("progress")) => {
  if (!el) return;
  el.value = val;
  el.style.setProperty("--value", (val / 10) + "%");
};

// Render library
function renderLibrary() {
  const list = $("songList");
  if (!list) return;
  
  list.innerHTML = songs.map((s, i) => `
    <div onclick="playSong(${i})" class="group bg-[#282828] rounded-lg p-4 cursor-pointer transition-all hover:bg-[#333] hover:-translate-y-1">
      <div class="relative aspect-square rounded-md overflow-hidden bg-[#1a1a1a] mb-3">
        <img src="${s.cover}" alt="${s.name}" loading="lazy" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-end p-3">
          <button onclick="event.stopPropagation(); playSong(${i})" class="w-12 h-12 bg-white hover:bg-gray-200 hover:cursor-pointer rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-lg" aria-label="Play ${s.name}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
      </div>
      <div class="text-sm font-semibold truncate" title="${s.name}">${s.name}</div>
      <div class="text-xs text-gray-400 truncate mt-1">${s.artist}</div>
      ${i === currentIndex ? '<span class="inline-block mt-2 px-2 py-1 bg-white text-black text-[11px] font-bold rounded">ON TRACK</span>' : ''}
    </div>
  `).join("");
}

// Play song
function playSong(i) {
  loadSong(i);
  isPlaying = false;
  play();
  renderLibrary();
}

// Load song
function loadSong(i) {
  if (i < 0 || i >= songs.length) return;
  currentIndex = i;
  localStorage.setItem("lastSong", i);
  
  const s = songs[i];
  audio.src = s.url;
  
  // Update all UI
  setText("name", s.name);
  setText("artist", s.artist);
  setImg("cover", s.cover);
  setText("nameLarge", s.name);
  setText("artistLarge", s.artist);
  setHTML("description", s.description || "No description");
  setImg("coverLarge", s.cover);
  
  // Mobile
  setImg("mCover", s.cover);
  setText("mName", s.name);
  setText("mArtist", s.artist);
  setHTML("mDescription", s.description || "No description");
  
  // Date
  const dateStr = s.date ? new Date(s.date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"}) : "N/A";
  setText("date", dateStr);
  setText("mDate", dateStr);
}

// Controls
function play() {
  if (!audio.src) loadSong(currentIndex);
  isPlaying ? audio.pause() : audio.play();
  isPlaying = !isPlaying;
  
  const playIcon = $("playBtn")?.querySelector('.play-icon');
  const pauseIcon = $("playBtn")?.querySelector('.pause-icon');
  playIcon?.classList.toggle('hidden', isPlaying);
  pauseIcon?.classList.toggle('hidden', !isPlaying);
  
  const mPlay = $("mPlayBtn");
  if (mPlay) mPlay.innerHTML = isPlaying 
    ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="black"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
    : '<svg width="28" height="28" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>';
  
  const stat = isPlaying ? "Playing" : "Paused";
  setText("status", stat);
  setText("mStatus", stat);
}

function next() {
  if (isLooping) { audio.currentTime = 0; if (isPlaying) audio.play(); return; }
  loadSong((currentIndex + 1) % songs.length);
  renderLibrary();
  if (isPlaying) audio.play();
}

function prev() {
  loadSong((currentIndex - 1 + songs.length) % songs.length);
  renderLibrary();
  if (isPlaying) audio.play();
}

function toggleLoop() {
  isLooping = !isLooping;
  $("loopBtn")?.classList.toggle("active", isLooping);
}

// Update UI
function updateProgress() {
  if (!audio.duration) return;
  const prog = (audio.currentTime / audio.duration) * 1000;
  setProgress(prog);
  setProgress(prog, $("mProgress"));
  setText("current", formatTime(audio.currentTime));
  setText("mCurrent", formatTime(audio.currentTime));
  const stat = isPlaying ? "Playing" : "Paused";
  setText("status", stat);
  setText("mStatus", stat);
}

function updateDuration() {
  const dur = formatTime(audio.duration);
  setText("total", dur);
  setText("duration", dur);
  setText("mTotal", dur);
  setText("mDuration", dur);
}

// Mobile
function openMobile() {
  if (window.innerWidth > 640) return;
  const m = $("mobile");
  if (!m) return;
  
  const prog = audio.duration ? (audio.currentTime / audio.duration) * 1000 : 0;
  setProgress(prog, $("mProgress"));
  $("loopBtn")?.classList.toggle("active", isLooping);
  
  m.classList.remove("hidden");
  m.offsetHeight; // Force reflow
  m.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobile() {
  const m = $("mobile");
  if (!m) return;
  m.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => { if (!m.classList.contains("open")) m.classList.add("hidden"); }, 300);
}