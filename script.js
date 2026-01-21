// Music data
const songs = [
  {
    id: 1,
    name: "Sreehari (FL studio remake)",
    artist: "Arjun Liji",
    url: "music/sreehari/audio.mp3",
    cover: "music/sreehari/cover.png",
  },
  {
    id: 2,
    name: "What is love? (FL studio remake)",
    artist: "Arjun Liji",
    url: "music/whatislove/audio.mp3",
    cover: "music/whatislove/cover.png",
  },
];

let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadSong(currentSongIndex);
  renderLibrary();
  updateUI();
});

// Render song library
function renderLibrary() {
  const songList = document.getElementById("songList");
  if (!songList) return;

  songList.innerHTML = songs
    .map(
      (song, index) => `
    <div onclick="playSong(${index})" class="rounded-lg cursor-pointer h-50 w-50">
      <img src="${song.cover}" alt="${song.name}" class="w-50 h-50 object-cover rounded-md mb-3 absolute z-0" />
      <div class="z-3"> 
        <h3 class="text-white font-semibold truncate">${song.name}</h3>
        <p class="text-gray-400 text-sm truncate">${song.artist}</p>
        ${currentSongIndex === index ? '<span class="text-green-400 text-xs">On track</span>' : ""}
      </div>
    </div>
  `,
    )
    .join("");
}

// Play specific song
function playSong(index) {
  loadSong(index);
  play();
}

// Load song
function loadSong(index) {
  if (index < 0 || index >= songs.length) return;

  currentSongIndex = index;
  const song = songs[index];

  audio.src = song.url;
  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;

  const coverImg = document.querySelector('img[alt="cover"]');
  if (coverImg) {
    coverImg.src = song.cover;
    coverImg.onerror = function () {
      this.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23333' width='64' height='64'/%3E%3Ctext x='32' y='32' font-size='12' fill='%23666' text-anchor='middle' dominant-baseline='central'%3ENo Cover%3C/text%3E%3C/svg%3E";
    };
  }

  updateProgressBar();
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
}

// Next song
function next() {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  loadSong(nextIndex);
  renderLibrary();
  if (isPlaying) {
    play();
  }
}

// Previous song
function prev() {
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex);
  renderLibrary();
  if (isPlaying) {
    play();
  }
}

// Update play button
function updatePlayButton() {
  const btn = document.querySelector('button[onclick="play()"]');
  if (btn) {
    btn.textContent = isPlaying ? "❚❚" : "A";
  }
}

// Update progress bar
function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl = document.getElementById("totalTime");

  if (!progressBar) return;

  // Update on time change
  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 1000;
    progressBar.value = progress;
    progressBar.style.setProperty("--value", (progress / 1000 * 100) + "%");
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  // Update total duration when metadata loads
  audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  // Handle progress bar click
  progressBar.addEventListener("input", (e) => {
    const newTime = (e.target.value / 1000) * audio.duration;
    audio.currentTime = newTime;
    e.target.style.setProperty("--value", (e.target.value / 1000 * 100) + "%");
  });

  // Auto play next song when current ends
  audio.addEventListener("ended", () => {
    next();
  });
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
