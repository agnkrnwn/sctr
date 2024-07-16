let audioPlayer = new Audio();
let currentTrackIndex = 0;
let tracks = [];
let shuffleMode = false;

function highlightCurrentTrack() {
  const trackList = document.getElementById("track-list");
  const tracks = trackList.getElementsByTagName("li");

  for (let i = 0; i < tracks.length; i++) {
    if (i === currentTrackIndex) {
      tracks[i].classList.add("bg-blue-100", "dark:bg-blue-800");
    } else {
      tracks[i].classList.remove("bg-blue-100", "dark:bg-blue-800");
    }
  }
}

function loadTracks() {
  fetch("ceramah.json")
    .then((response) => response.json())
    .then((data) => {
      tracks = data;
      updatePlaylist();
      loadLastPlayedTrack();
      highlightCurrentTrack();
    });
}

function updatePlaylist(searchTerm = "") {
  const trackList = document.getElementById("track-list");
  trackList.innerHTML = "";
  tracks.forEach((track, index) => {
    if (track.judul.toLowerCase().includes(searchTerm.toLowerCase())) {
      const li = document.createElement("li");
      li.className =
        "cursor-pointer hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300 truncate p-2";
      li.textContent = track.judul;
      li.onclick = () => loadTrack(index);
      trackList.appendChild(li);
    }
  });
  highlightCurrentTrack();
}

function skipAudio(seconds) {
  audioPlayer.currentTime += seconds;
}

// Tambahkan tombol di HTML
// <button id="skip-backward" class="...">-10s</button>
// <button id="skip-forward" class="...">+10s</button>

// Tambahkan event listener
document
  .getElementById("skip-backward")
  .addEventListener("click", () => skipAudio(-10));
document
  .getElementById("skip-forward")
  .addEventListener("click", () => skipAudio(10));

function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[index];
  const titleElement = document.getElementById("current-title");

  titleElement.textContent = track.judul;

  audioPlayer.pause();
  showLoading();

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += 5;
    updateLoadingProgress(loadProgress);
    if (loadProgress >= 100) {
      clearInterval(loadInterval);
    }
  }, 50);

  audioPlayer.addEventListener(
    "canplay",
    function () {
      clearInterval(loadInterval);
      updateLoadingProgress(100);
      setTimeout(() => {
        hideLoading();
        playAudio();
      }, 200);
    },
    { once: true }
  );

  audioPlayer.src = track.link;

  const playPromise = audioPlayer.play();

  if (playPromise !== undefined) {
    playPromise
      .then((_) => {
        document.getElementById("play").classList.add("hidden");
        document.getElementById("pause").classList.remove("hidden");
      })
      .catch((error) => {
        console.log("Playback was prevented. Error: ", error);
        document.getElementById("pause").classList.add("hidden");
        document.getElementById("play").classList.remove("hidden");
      });
  }

  saveLastPlayedTrack(index);
  updateSeekBar();
  highlightCurrentTrack();
}

function playAudio() {
  const playPromise = audioPlayer.play();

  if (playPromise !== undefined) {
    playPromise
      .then((_) => {
        document.getElementById("play").classList.add("hidden");
        document.getElementById("pause").classList.remove("hidden");
      })
      .catch((error) => {
        console.log("Playback was prevented. Error: ", error);
        document.getElementById("pause").classList.add("hidden");
        document.getElementById("play").classList.remove("hidden");
      });
  }
}

function showLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.classList.remove("hidden");
  updateLoadingProgress(0);
}

function hideLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.classList.add("hidden");
}

function updateLoadingProgress(percent) {
  const circle = document.querySelector("#loading circle:nth-child(2)");
  const percentText = document.querySelector("#loading .absolute span");
  const offset = 264 - (264 * percent) / 100;
  circle.style.strokeDashoffset = offset;
  percentText.textContent = `${percent}%`;
}

function pauseAudio() {
  audioPlayer.pause();
  document.getElementById("pause").classList.add("hidden");
  document.getElementById("play").classList.remove("hidden");
}

function stopAudio() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  document.getElementById("pause").classList.add("hidden");
  document.getElementById("play").classList.remove("hidden");
}

function nextTrack() {
  if (shuffleMode) {
    currentTrackIndex = Math.floor(Math.random() * tracks.length);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  }
  loadTrack(currentTrackIndex);
}

function prevTrack() {
  if (shuffleMode) {
    currentTrackIndex = Math.floor(Math.random() * tracks.length);
  } else {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  }
  loadTrack(currentTrackIndex);
}

function toggleShuffle() {
  shuffleMode = !shuffleMode;
  document.getElementById("shuffle").classList.toggle("text-blue-500");
}

function updateSeekBar() {
  const seekBar = document.getElementById("seek-bar");
  seekBar.max = audioPlayer.duration;
  seekBar.value = audioPlayer.currentTime;
}

function seekAudio() {
  const seekBar = document.getElementById("seek-bar");
  audioPlayer.currentTime = seekBar.value;
}

// Tambahkan event listener ini
document.getElementById("seek-bar").addEventListener("input", seekAudio);

// Modifikasi fungsi updateProgress
function updateProgress() {
  const currentTime = document.getElementById("current-time");
  const duration = document.getElementById("duration");

  updateSeekBar();

  currentTime.textContent = formatTime(audioPlayer.currentTime);
  duration.textContent = formatTime(audioPlayer.duration);
}

// function updateProgress() {
//     const progress = document.getElementById('progress');
//     const currentTime = document.getElementById('current-time');
//     const duration = document.getElementById('duration');

//     const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
//     progress.style.width = `${percent}%`;

//     currentTime.textContent = formatTime(audioPlayer.currentTime);
//     duration.textContent = formatTime(audioPlayer.duration);
// }

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const themeIcon = document.getElementById("toggle-theme").querySelector("i");
  if (document.documentElement.classList.contains("dark")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
}

function toggleFavorite(index) {
  tracks[index].favorite = !tracks[index].favorite;
  updatePlaylist(document.getElementById("search").value);
  saveFavorites();
}

function saveFavorites() {
  const favorites = tracks.reduce((acc, track, index) => {
    if (track.favorite) acc.push(index);
    return acc;
  }, []);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.forEach((index) => {
    if (tracks[index]) tracks[index].favorite = true;
  });
  updatePlaylist();
}

function saveLastPlayedTrack(index) {
  localStorage.setItem("lastPlayedTrack", index);
}

function loadLastPlayedTrack() {
  const lastPlayedIndex = localStorage.getItem("lastPlayedTrack");
  if (lastPlayedIndex !== null) {
    currentTrackIndex = parseInt(lastPlayedIndex);
    const track = tracks[currentTrackIndex];
    document.getElementById("current-title").textContent = track.judul;
    audioPlayer.src = track.link;
    audioPlayer.load();
    // Tidak langsung memutar, hanya menyiapkan track
  }
}

document.getElementById("play").onclick = playAudio;
document.getElementById("pause").onclick = pauseAudio;
document.getElementById("stop").onclick = stopAudio;
document.getElementById("next").onclick = nextTrack;
document.getElementById("prev").onclick = prevTrack;
document.getElementById("shuffle").onclick = toggleShuffle;

document.getElementById("toggle-playlist").onclick = () => {
  const playlist = document.getElementById("playlist");
  const searchInput = document.getElementById("search");

  if (playlist.classList.contains("hidden")) {
    playlist.classList.remove("hidden");
    updatePlaylist();
  } else {
    playlist.classList.add("hidden");
    searchInput.value = ""; // Reset search input
    updatePlaylist(); // Reset playlist view
  }
};

document.getElementById("search").addEventListener("input", (e) => {
  updatePlaylist(e.target.value);
});

document.getElementById("toggle-theme").onclick = toggleTheme;
document.getElementById("volume").oninput = (e) => {
  audioPlayer.volume = e.target.value;
};
// Modifikasi event listener untuk slider kecepatan pemutaran
document.getElementById("playback-speed").oninput = (e) => {
  const speed = parseFloat(e.target.value);
  audioPlayer.playbackRate = speed;
  document.getElementById("speed-value").textContent = `${speed.toFixed(1)}x`;
};

audioPlayer.addEventListener("timeupdate", updateProgress);
audioPlayer.addEventListener("ended", nextTrack);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    audioPlayer.paused ? playAudio() : pauseAudio();
  } else if (e.code === "ArrowLeft") {
    prevTrack();
  } else if (e.code === "ArrowRight") {
    nextTrack();
  }
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

loadTracks();
