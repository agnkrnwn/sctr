let selectedQari = "05"; // Default to Misyari Rasyid Al-Afasi

function updateQariSelection() {
  const qariSelect = document.getElementById("qariSelect");
  selectedQari = qariSelect.value;
  localStorage.setItem("selectedQari", selectedQari);
}

let currentSurah = null;
let bookmarks = JSON.parse(localStorage.getItem("quranBookmarks-00981")) || [];

function toggleBookmark(surahNumber, ayatNumber) {
  const bookmarkIndex = bookmarks.findIndex(
    (b) => b.surah === surahNumber && b.ayat === ayatNumber
  );
  if (bookmarkIndex > -1) {
    bookmarks.splice(bookmarkIndex, 1);
    alert(`Bookmark untuk Surah ${surahNumber} Ayat ${ayatNumber} telah dihapus.`);
  } else {
    bookmarks.push({ surah: surahNumber, ayat: ayatNumber });
    alert(`Bookmark untuk Surah ${surahNumber} Ayat ${ayatNumber} telah ditambahkan.`);
  }
  localStorage.setItem("quranBookmarks-00981", JSON.stringify(bookmarks));
  updateBookmarkButtons();
}

function updateBookmarkButtons() {
  if (!currentSurah) return; // Exit if currentSurah is not set

  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    const surahNumber = currentSurah.nomor;
    const ayatNumber = parseInt(btn.closest('[data-ayat]').getAttribute('data-ayat'));
    const isBookmarked = bookmarks.some(b => b.surah === surahNumber && b.ayat === ayatNumber);
    btn.innerHTML = isBookmarked ? '<i class="fas fa-bookmark"></i>' : '<i class="far fa-bookmark"></i>';
  });
}

function getSurahName(surahNumber) {
  const surahNames = [
    "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah",
    "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Taubah", "Yunus",
    "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr",
    "An-Nahl", "Al-Isra'", "Al-Kahf", "Maryam", "Ta Ha",
    "Al-Anbiya'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan",
    "Asy-Syu'ara'", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum",
    "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir",
    "Ya Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jasiyah",
    "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
    "Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman",
    "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hasyr", "Al-Mumtahanah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq",
    "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
    "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddassir", "Al-Qiyamah",
    "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj",
    "At-Tariq", "Al-A'la", "Al-Ghasyiyah", "Al-Fajr", "Al-Balad",
    "Asy-Syams", "Al-Lail", "Ad-Duha", "Asy-Syarh", "At-Tin",
    "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
    "Al-Qari'ah", "At-Takasur", "Al-'Asr", "Al-Humazah", "Al-Fil",
    "Quraisy", "Al-Ma'un", "Al-Kausar", "Al-Kafirun", "An-Nasr",
    "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];
  return surahNames[surahNumber - 1] || `Surah ${surahNumber}`;
}

function showBookmarkList() {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <h2 class="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Bookmarks</h2>
      <ul id="bookmarkList" class="space-y-2"></ul>
      <button id="closeBookmarkList" class="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  const bookmarkList = document.getElementById('bookmarkList');
  bookmarkList.innerHTML = ''; // Clear existing bookmarks

  if (bookmarks.length === 0) {
    bookmarkList.innerHTML = '<li class="text-gray-500 dark:text-gray-400">Tidak ada bookmark tersimpan.</li>';
  } else {
    bookmarks.forEach(bookmark => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700';
      
      const surahName = getSurahName(bookmark.surah);
      
      li.innerHTML = `
        <div class="flex-grow">
          <span class="font-semibold text-primary-600 dark:text-primary-400">Surah ${bookmark.surah}: ${surahName}</span>
          <br>
          <span class="text-sm text-gray-600 dark:text-gray-400">Ayat ${bookmark.ayat}</span>
        </div>
        <div class="flex space-x-2 ml-2">
          <button class="go-to-bookmark p-2 text-white hover:bg-primary-600 transition-colors duration-200" data-surah="${bookmark.surah}" data-ayat="${bookmark.ayat}" title="Lihat">
            <i class="fas fa-eye"></i>
          </button>
          <button class="remove-bookmark p-2 text-white hover:bg-red-600 transition-colors duration-200" data-surah="${bookmark.surah}" data-ayat="${bookmark.ayat}" title="Hapus">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      bookmarkList.appendChild(li);
    });
  }

  document.getElementById("closeBookmarkList").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  bookmarkList.addEventListener("click", (e) => {
    if (e.target.closest(".go-to-bookmark")) {
      const button = e.target.closest(".go-to-bookmark");
      const surah = parseInt(button.getAttribute("data-surah"));
      const ayat = parseInt(button.getAttribute("data-ayat"));
      fetchSurahDetail(surah);
      setTimeout(() => {
        goToAyat(ayat, document.getElementById("ayatContainer"));
      }, 1000);
      document.body.removeChild(modal);
    } else if (e.target.closest(".remove-bookmark")) {
      const button = e.target.closest(".remove-bookmark");
      const surah = parseInt(button.getAttribute("data-surah"));
      const ayat = parseInt(button.getAttribute("data-ayat"));
      toggleBookmark(surah, ayat);
      document.body.removeChild(modal); // Tutup modal setelah menghapus bookmark
    }
  });
}

function goToAyat(ayatNumber, container) {
  const ayatElement = container.querySelector(`[data-ayat="${ayatNumber}"]`);
  if (ayatElement) {
    ayatElement.scrollIntoView({ behavior: "smooth", block: "center" });
    // Optionally highlight the ayat
    ayatElement.classList.add("highlight-ayat");
    setTimeout(() => {
      ayatElement.classList.remove("highlight-ayat");
    }, 2000); // Remove highlight after 2 seconds
  }
}

/////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const qariSelect = document.getElementById("qariSelect");
  const storedQari = localStorage.getItem("selectedQari");
  if (storedQari) {
    selectedQari = storedQari;
    qariSelect.value = selectedQari;
  }
  qariSelect.addEventListener("change", () => {
    updateQariSelection();
    updateAudioSources();
  });
  document
    .getElementById("bookmarkListButton")
    .addEventListener("click", showBookmarkList);

  const searchInput = document.getElementById("searchInput");
  const surahList = document.getElementById("surahList");
  const surahDetail = document.getElementById("surahDetail");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const scrollToTopBtn = document.createElement("button");

  let allSurahs = [];
  let surahCache = new Map();
  let currentSurah = null;
  let currentAyatIndex = 0;
  let isAutoPlaying = false;
  let currentAudio = null;

  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className =
    "fixed bottom-4 right-4 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200 z-50";
  scrollToTopBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      transform: translateY(100px);
    `;
  document.body.appendChild(scrollToTopBtn);

  fetchSurahList();

  darkModeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "darkMode",
      document.documentElement.classList.contains("dark")
    );
  });

  if (
    localStorage.getItem("darkMode") === "true" ||
    (!("darkMode" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  }

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredSurahs = allSurahs.filter(
      (surah) =>
        surah.namaLatin.toLowerCase().includes(searchTerm) ||
        surah.arti.toLowerCase().includes(searchTerm) ||
        surah.nama.toLowerCase().includes(searchTerm) ||
        surah.nomor.toString().includes(searchTerm)
    );
    displayAllSurahs(filteredSurahs);
  });

  async function fetchSurahList() {
    try {
      const response = await fetch("./surat/surat.json");
      const data = await response.json();

      if (data.code === 200) {
        allSurahs = data.data;
        displayAllSurahs(allSurahs);
      } else {
        surahList.innerHTML =
          '<p class="text-red-500">Gagal memuat daftar surah.</p>';
      }
    } catch (error) {
      console.error("Error:", error);
      surahList.innerHTML =
        '<p class="text-red-500">Terjadi kesalahan. Silakan coba lagi nanti.</p>';
    }
  }

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.transform = "translateY(0)";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.transform = "translateY(100px)";
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function displayAllSurahs(surahs) {
    surahList.innerHTML = surahs
      .map(
        (surah) => `
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" onclick="fetchSurahDetail(${surah.nomor})" style="display: flex; justify-content: space-between; align-items: center;">
              <div>
              <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400">${surah.nomor}. ${surah.namaLatin}</h3>
              <p class="text-gray-600 dark:text-gray-400">${surah.arti}</p>
              <p class="text-sm text-gray-500 dark:text-gray-500">${surah.jumlahAyat} ayat</p>
              </div>
              <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400">${surah.nama}</h3>
              </div>
          `
      )
      .join("");
  }

  window.fetchSurahDetail = async function (nomorSurah) {
    try {
      if (surahCache.has(nomorSurah)) {
        const { surahData, tafsirData } = surahCache.get(nomorSurah);
        displaySurahDetail(surahData, tafsirData);
        surahDetail.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const [surahResponse, tafsirResponse] = await Promise.all([
        fetch(`./surat/${nomorSurah}.json`),
        fetch(`./tafsir/${nomorSurah}.json`),
      ]);

      let surahData, tafsirData;

      try {
        surahData = await surahResponse.json();
      } catch (error) {
        console.error("Error parsing surah data:", error);
        surahData = { code: 500, message: "Error parsing surah data" };
      }

      try {
        tafsirData = await tafsirResponse.json();
      } catch (error) {
        console.error("Error parsing tafsir data:", error);
        tafsirData = { code: 500, message: "Error parsing tafsir data" };
      }

      if (surahData.code === 200 && tafsirData.code === 200) {
        currentSurah = surahData.data; // Set currentSurah here
        surahCache.set(nomorSurah, {
          surahData: surahData.data,
          tafsirData: tafsirData.data,
        });
        displaySurahDetail(surahData.data, tafsirData.data);
        surahDetail.scrollIntoView({ behavior: "smooth" });
      } else {
        let errorMessage = "";
        if (surahData.code !== 200)
          errorMessage += `Gagal memuat detail surah: ${surahData.message}. `;
        if (tafsirData.code !== 200)
          errorMessage += `Gagal memuat tafsir: ${tafsirData.message}.`;
        surahDetail.innerHTML = `<p class="text-red-500">${errorMessage}</p>`;
      }
    } catch (error) {
      console.error("Error:", error);
      surahDetail.innerHTML =
        '<p class="text-red-500">Terjadi kesalahan. Silakan coba lagi nanti.</p>';
    }
  };

  function displaySurahDetail(surah, tafsir) {
    const qariName =
      document.getElementById("qariSelect").options[
        document.getElementById("qariSelect").selectedIndex
      ].text;
    currentSurah = surah;
    surahDetail.innerHTML = `
          <div class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-400">${surah.nomor}. ${surah.namaLatin} (${surah.nama})</h2>
              <div>
                <button id="audioToggle" class="text-primary-500 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-2">
                  <i class="fas fa-play mr-1"></i> Full
                </button>
              </div>
            </div>
            <audio id="surahAudio" src="${surah.audioFull[selectedQari]}" preload="none"></audio>
            <div id="audioInfo" class="mb-4 hidden">
              <p class="text-gray-700 dark:text-gray-300">Now playing: ${surah.namaLatin} Qari: ${qariName}</p>
              <div id="progressBar" class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                <div id="progressBarFill" class="bg-primary-600 h-2.5 rounded-full" style="width: 0%"></div>
              </div>
            </div>
            <div class="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong class="font-semibold">Arti:</strong> ${surah.arti}</p>
              <p><strong class="font-semibold">Jumlah Ayat:</strong> ${surah.jumlahAyat}</p>
              <p><strong class="font-semibold">Tempat Turun:</strong> ${surah.tempatTurun}</p>
              <p><strong class="font-semibold">Deskripsi:</strong> ${surah.deskripsi}</p>
            </div>
            <div class="mt-4 space-x-2 flex items-center">
              <button id="toggleAyatBtn" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200 text-sm leading-tight">
                <i class="fas fa-expand"></i>
              </button>
              
              <input id="ayatInput" type="number" min="1" max="${surah.jumlahAyat}" class="ml-2 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm leading-tight focus:outline-none focus:border-primary-500" placeholder="Go to Ayat">
              <button id="goToAyatBtn" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200 text-sm leading-tight">
              <i class="fas fa-search"></i>
              </button>
              <button id="autoPlayToggle" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200 text-sm leading-tight">
              <i class="fas fa-forward"></i>
              </button>
              
            </div>
            <div id="ayatContainer" class="mt-4"></div>
          </div>
        `;

    const audioToggle = document.getElementById("audioToggle");
    const autoPlayToggle = document.getElementById("autoPlayToggle");
    const audio = document.getElementById("surahAudio");
    const toggleAyatBtn = document.getElementById("toggleAyatBtn");
    const ayatContainer = document.getElementById("ayatContainer");
    const ayatInput = document.getElementById("ayatInput");
    const goToAyatBtn = document.getElementById("goToAyatBtn");
    const audioInfo = document.getElementById("audioInfo");
    const progressBarFill = document.getElementById("progressBarFill");

    audioToggle.addEventListener("click", () =>
      toggleFullAudio(audio, audioToggle, audioInfo, progressBarFill)
    );
    autoPlayToggle.addEventListener("click", () => startAutoPlay(surah.ayat));
    toggleAyatBtn.addEventListener("click", () =>
      toggleAyat(surah.ayat, tafsir.tafsir, toggleAyatBtn, ayatContainer)
    );
    goToAyatBtn.addEventListener("click", () =>
      goToAyat(ayatInput.value, ayatContainer)
    );

    audio.addEventListener("timeupdate", () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBarFill.style.width = `${progress}%`;
    });

    displayAyatWithTafsir(surah.ayat, tafsir.tafsir, ayatContainer);
    updateBookmarkButtons();
  }

  function toggleFullAudio(audio, button, audioInfo, progressBarFill) {
    if (audio.paused) {
      audio.play();
      button.innerHTML = '<i class="fas fa-pause mr-1"></i> Full';
      audioInfo.classList.remove("hidden");

      audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBarFill.style.width = `${progress}%`;
      });
    } else {
      audio.pause();
      button.innerHTML = '<i class="fas fa-play mr-1"></i> Full';
      audioInfo.classList.add("hidden");
    }
  }

  function startAutoPlay(ayat) {
    if (isAutoPlaying) {
      stopAutoPlay();
      return;
    }

    isAutoPlaying = true;
  currentAyatIndex = currentSurah.nomor === 9 ? 0 : -1; // Start from 0 for At-Taubah, -1 for others
  document.getElementById("autoPlayToggle").innerHTML = '<i class="fas fa-pause"></i>';
  playNextAyat(ayat);

    // Add overlay pause button
    const overlay = document.createElement("div");
    overlay.id = "pauseOverlay";
    overlay.innerHTML =
      '<button id="overlayPauseBtn" class="bg-primary-500 text-white p-3 w-12 h-12 rounded-full flex items-center justify-center"><i class="fas fa-pause"></i></button>';
    overlay.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        `;
    document.body.appendChild(overlay);

    document
      .getElementById("overlayPauseBtn")
      .addEventListener("click", stopAutoPlay);
  }

  function stopAutoPlay() {
    isAutoPlaying = false;
    document.getElementById("autoPlayToggle").innerHTML =
      '<i class="fas fa-play"></i>';
    const audio = document.querySelector(
      `audio[data-ayat="${currentAyatIndex}"]`
    );
    if (audio) {
      audio.pause();
    }
    const overlay = document.getElementById("pauseOverlay");
    if (overlay) {
      overlay.remove();
    }
  }

  function playNextAyat(ayat) {
    if (!isAutoPlaying || currentAyatIndex >= ayat.length) {
      stopAutoPlay();
      return;
    }
  
    let audioSrc;
    if (currentAyatIndex === -1 && currentSurah.nomor !== 9) {
      // Play Bismillah audio
      audioSrc = "path/to/bismillah/audio.mp3"; // You need to provide the correct path
    } else {
      const currentAyat = ayat[currentAyatIndex];
      audioSrc = currentAyat.audio[selectedQari];
    }
  
    const audio = new Audio(audioSrc);
    audio.setAttribute("data-ayat", currentAyatIndex);
  
    highlightCurrentAyat(currentAyatIndex);
  
    audio.play();
    audio.onended = () => {
      currentAyatIndex++;
      playNextAyat(ayat);
    };
  }

  function highlightCurrentAyat(ayatIndex) {
    const ayatElements = document.querySelectorAll("[data-ayat]");
    ayatElements.forEach((element) => {
      if (
        (ayatIndex === -1 && element.dataset.ayat === "bismillah" && currentSurah.nomor !== 9) ||
        element.dataset.ayat === (ayatIndex + 1).toString()
      ) {
        element.classList.add("current-ayat");
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        element.classList.remove("current-ayat");
      }
    });
  }

  function toggleAyat(ayat, tafsir, button, container) {
    if (container.classList.contains("hidden")) {
      displayAyatWithTafsir(ayat, tafsir, container);
      button.innerHTML = '<i class="fas fa-compress"></i>';
      container.classList.remove("hidden");
    } else {
      container.innerHTML = "";
      button.innerHTML = '<i class="fas fa-expand"></i>';
      container.classList.add("hidden");
    }
  }

  function goToAyat(ayatNumber, container) {
    const ayatElement = container.querySelector(`[data-ayat="${ayatNumber}"]`);
    if (ayatElement) {
      ayatElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  function displayAyatWithTafsir(ayat, tafsir, container) {
    container.innerHTML = `
      <h3 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Ayat-ayat:</h3>
      <div id="ayatList" class="space-y-6"></div>
    `;
  
    const ayatList = document.getElementById("ayatList");
    const fragment = document.createDocumentFragment();
  
    // Add Bismillah at the beginning (except for Surah At-Taubah)
    if (currentSurah.nomor !== 9) {
      const bismillahDiv = document.createElement("div");
      bismillahDiv.className = "border-b border-gray-200 dark:border-gray-700 pb-4";
      bismillahDiv.setAttribute("data-ayat", "bismillah");
      bismillahDiv.innerHTML = `
        <p class="text-right text-2xl my-5 font-arabic leading-relaxed" style="line-height: 2.5;">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p class="mb-1 text-lg">bismillāhir-raḥmānir-raḥīm</p>
        <p class="text-gray-600 dark:text-gray-400">Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.</p>
      `;
      fragment.appendChild(bismillahDiv);
    }
  
  
    ayat.forEach((a, index) => {
      const div = document.createElement("div");
      div.className = "border-b border-gray-200 dark:border-gray-700 pb-4";
      div.setAttribute("data-ayat", a.nomorAyat);
      div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <span class="text-lg font-semibold">${a.nomorAyat}.</span>
          <div>
            <button class="play-audio-btn text-primary-500 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-2" data-audio='${JSON.stringify(a.audio)}'>
              <i class="fas fa-play"></i>
            </button>
            <a href="${a.audio["05"]}" target="_blank" class="text-primary-500 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-2">
              <i class="fa-solid fa-file-audio"></i>
            </a>
            <button class="download-image-btn text-primary-500 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-2">
              <i class="fas fa-download"></i>
            </button>
            <button class="bookmark-btn text-primary-500 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
              <i class="far fa-bookmark"></i>
            </button>
          </div>
        </div>
        <p class="text-right text-2xl my-5 font-arabic leading-relaxed" style="line-height: 2.5;">${a.teksArab}</p>
        <p class="mb-1 text-lg">${a.teksLatin}</p>
        <p class="text-gray-600 dark:text-gray-400">${a.teksIndonesia}</p>
        <!-- ... rest of the ayat content ... -->
      `;
      fragment.appendChild(div);
    });
  
    ayatList.appendChild(fragment);

    // Add event listeners
    const audioButtons = ayatList.querySelectorAll(".play-audio-btn");
    audioButtons.forEach((button) => {
      button.addEventListener("click", () => playAyatAudio(button));
    });

    const tafsirButtons = ayatList.querySelectorAll(".toggle-tafsir-btn");
    tafsirButtons.forEach((button) => {
      button.addEventListener("click", () => toggleTafsirPerAyat(button));
    });

    const downloadButtons = ayatList.querySelectorAll(".download-image-btn");
    downloadButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const ayatElement = button.closest("[data-ayat]");
        const ayatNumber = ayatElement.getAttribute("data-ayat");
        downloadAyatImageForTikTok(ayatElement, ayatNumber);
      });
    });

    const copyTafsirButtons = ayatList.querySelectorAll(".copy-tafsir-btn");
    copyTafsirButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tafsirText = button.previousElementSibling.textContent;
        copyTafsir(tafsirText);
      });
    });

    // Add event listeners for bookmark buttons
    const bookmarkButtons = ayatList.querySelectorAll(".bookmark-btn");
    bookmarkButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const ayatElement = button.closest("[data-ayat]");
        const ayatNumber = parseInt(ayatElement.getAttribute("data-ayat"));
        toggleBookmark(currentSurah.nomor, ayatNumber);
      });
    });

    updateBookmarkButtons();
  }

  function downloadAyatImageForTikTok(ayatElement, ayatNumber) {
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "1080px";
    tempDiv.style.height = "1920px";
    tempDiv.style.backgroundColor = "#26282A";
    tempDiv.style.color = "white";
    tempDiv.style.fontFamily = "Poppins, sans-serif";
    tempDiv.style.display = "flex";
    tempDiv.style.flexDirection = "column";
    tempDiv.style.justifyContent = "center";
    tempDiv.style.alignItems = "center";
    tempDiv.style.padding = "50px";
    tempDiv.style.boxSizing = "border-box";

    const contentWrapper = document.createElement("div");
    contentWrapper.style.width = "100%";
    contentWrapper.style.maxWidth = "800px";
    contentWrapper.style.margin = "0 auto";

    const arabicText = document.createElement("p");
    arabicText.textContent =
      ayatElement.querySelector(".font-arabic").textContent;
    arabicText.style.fontSize = "clamp(25px, 7vw, 50px)";
    arabicText.style.fontFamily = '"Traditional Arabic", Arial';
    arabicText.style.textAlign = "right";
    arabicText.style.direction = "rtl";
    arabicText.style.marginBottom = "30px";

    const latinText = document.createElement("p");
    latinText.textContent =
      ayatElement.querySelector("p:nth-of-type(2)").textContent;
    latinText.style.fontSize = "clamp(18px, 3.5vw, 36px)";
    latinText.style.textAlign = "left";
    latinText.style.marginBottom = "20px";

    const indonesianText = document.createElement("p");
    indonesianText.textContent =
      ayatElement.querySelector("p:nth-of-type(3)").textContent;
    indonesianText.style.fontSize = "clamp(16px, 3vw, 30px)";
    indonesianText.style.textAlign = "left";
    indonesianText.style.marginBottom = "30px";

    const title = document.createElement("p");
    title.textContent = `${currentSurah.namaLatin} - ${currentSurah.nama} :  ${ayatNumber}`;
    title.style.textAlign = "center";
    title.style.fontSize = "clamp(15px, 5vw, 30px)";

    // Tambahkan informasi qari
    // const qariName = document.getElementById("qariSelect").options[document.getElementById("qariSelect").selectedIndex].text;
    // const qariInfo = document.createElement('p');
    // qariInfo.textContent = `Qari: ${qariName}`;
    // qariInfo.style.fontSize = 'clamp(14px, 2.5vw, 24px)';
    // qariInfo.style.textAlign = 'center';
    // qariInfo.style.marginTop = '20px';

    contentWrapper.appendChild(arabicText);
    contentWrapper.appendChild(latinText);
    contentWrapper.appendChild(indonesianText);
    contentWrapper.appendChild(title);
    // contentWrapper.appendChild(qariInfo);
    tempDiv.appendChild(contentWrapper);

    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, {
      width: 1080,
      height: 1920,
      scale: 1,
    }).then((canvas) => {
      document.body.removeChild(tempDiv);

      const link = document.createElement("a");
      link.download = `${currentSurah.namaLatin}-Ayat-${ayatNumber}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  }

  function copyTafsir(tafsirText) {
    navigator.clipboard
      .writeText(tafsirText)
      .then(() => {
        alert("Tafsir berhasil disalin!");
      })
      .catch((err) => {
        console.error("Gagal menyalin tafsir: ", err);
      });
  }

  function updateAudioSources() {
    const surahAudio = document.getElementById("surahAudio");
    if (surahAudio && currentSurah) {
      surahAudio.src = currentSurah.audioFull[selectedQari];
    }

    const playButtons = document.querySelectorAll(".play-audio-btn");
    playButtons.forEach((button) => {
      const audioData = JSON.parse(button.dataset.audio);
      button.dataset.currentAudio = audioData[selectedQari];
    });
  }

  function playAyatAudio(button) {
    const audioData = JSON.parse(button.dataset.audio);
    const audioSrc = audioData[selectedQari];

    if (currentAudio && currentAudio.src === audioSrc) {
      if (currentAudio.paused) {
        currentAudio.play();
        button.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        currentAudio.pause();
        button.innerHTML = '<i class="fas fa-play"></i>';
      }
    } else {
      if (currentAudio) {
        currentAudio.pause();
        const prevButton = document.querySelector(
          '.play-audio-btn[data-playing="true"]'
        );
        if (prevButton) {
          prevButton.innerHTML = '<i class="fas fa-play"></i>';
          prevButton.removeAttribute("data-playing");
        }
      }

      currentAudio = new Audio(audioSrc);
      currentAudio.play();
      button.innerHTML = '<i class="fas fa-pause"></i>';
      button.setAttribute("data-playing", "true");

      currentAudio.onended = () => {
        button.innerHTML = '<i class="fas fa-play"></i>';
        button.removeAttribute("data-playing");
        currentAudio = null;
      };
    }
  }

  function toggleTafsirPerAyat(button) {
    const tafsirContainer = button.nextElementSibling;
    const chevronIcon = button.querySelector("i");

    if (tafsirContainer.classList.contains("hidden")) {
      tafsirContainer.classList.remove("hidden");
      button.innerHTML = `Hide Tafsir <i class="fas fa-chevron-up ml-1"></i>`;
    } else {
      tafsirContainer.classList.add("hidden");
      button.innerHTML = `Show Tafsir <i class="fas fa-chevron-down ml-1"></i>`;
    }
  }
});
