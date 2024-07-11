document.addEventListener("DOMContentLoaded", () => {
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
    scrollToTopBtn.className = "fixed bottom-4 right-4 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200 z-50";
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
  
    // Dark mode toggle functionality
    darkModeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });
  
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true' || 
        (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
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
          fetch(`./tafsir/${nomorSurah}.json`)
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
          surahCache.set(nomorSurah, { surahData: surahData.data, tafsirData: tafsirData.data });
          displaySurahDetail(surahData.data, tafsirData.data);
          surahDetail.scrollIntoView({ behavior: "smooth" });
        } else {
          let errorMessage = "";
          if (surahData.code !== 200) errorMessage += `Gagal memuat detail surah: ${surahData.message}. `;
          if (tafsirData.code !== 200) errorMessage += `Gagal memuat tafsir: ${tafsirData.message}.`;
          surahDetail.innerHTML = `<p class="text-red-500">${errorMessage}</p>`;
        }
      } catch (error) {
        console.error("Error:", error);
        surahDetail.innerHTML =
          '<p class="text-red-500">Terjadi kesalahan. Silakan coba lagi nanti.</p>';
      }
    };
  
    function displaySurahDetail(surah, tafsir) {
      currentSurah = surah;
      surahDetail.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-400">${surah.nomor}. ${surah.namaLatin} (${surah.nama})</h2>
            <div>
              <button id="audioToggle" class="text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-2">
                <i class="fas fa-play mr-1"></i> Full
              </button>
            </div>
          </div>
          <audio id="surahAudio" src="${surah.audioFull["05"]}" preload="none"></audio>
          <div id="audioInfo" class="mb-4 hidden">
            <p class="text-gray-700 dark:text-gray-300">Now playing: ${surah.namaLatin}</p>
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
              <i class="fas fa-eye"></i> Ayat
            </button>
            <input id="ayatInput" type="number" min="1" max="${surah.jumlahAyat}" class="ml-2 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm leading-tight focus:outline-none focus:border-primary-500" placeholder="Go to Ayat">
            <button id="goToAyatBtn" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200 text-sm leading-tight">
            <i class="fas fa-search"></i>
            </button>
            
          </div>
          <div id="ayatContainer" class="mt-4 hidden"></div>
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
  
      audioToggle.addEventListener("click", () => toggleFullAudio(audio, audioToggle, audioInfo, progressBarFill));
      autoPlayToggle.addEventListener("click", () => startAutoPlay(surah.ayat));
      toggleAyatBtn.addEventListener("click", () => toggleAyat(surah.ayat, tafsir.tafsir, toggleAyatBtn, ayatContainer));
      goToAyatBtn.addEventListener("click", () => goToAyat(ayatInput.value, ayatContainer));
  
      audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBarFill.style.width = `${progress}%`;
      });
    }
  
    function toggleFullAudio(audio, button, audioInfo, progressBarFill) {
      if (audio.paused) {
        audio.play();
        button.innerHTML = '<i class="fas fa-pause mr-1"></i> Full';
        audioInfo.classList.remove("hidden");
        
        audio.addEventListener('timeupdate', () => {
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
      currentAyatIndex = 0;
      document.getElementById("autoPlayToggle").innerHTML = '<i class="fas fa-pause"></i>';
      playNextAyat(ayat);
  
      // Add overlay pause button
      const overlay = document.createElement('div');
      overlay.id = 'pauseOverlay';
      overlay.innerHTML = '<button id="overlayPauseBtn" class="bg-primary-950 text-white p-3 w-12 h-12 rounded-full flex items-center justify-center"><i class="fas fa-pause"></i></button>';
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
  
      document.getElementById('overlayPauseBtn').addEventListener('click', stopAutoPlay);
    }
  
    function stopAutoPlay() {
      isAutoPlaying = false;
      document.getElementById("autoPlayToggle").innerHTML = '<i class="fas fa-play"></i>';
      const audio = document.querySelector(`audio[data-ayat="${currentAyatIndex}"]`);
      if (audio) {
        audio.pause();
      }
      const overlay = document.getElementById('pauseOverlay');
      if (overlay) {
        overlay.remove();
      }
    }
  
    function playNextAyat(ayat) {
      if (!isAutoPlaying || currentAyatIndex >= ayat.length) {
        stopAutoPlay();
        return;
      }
  
      const currentAyat = ayat[currentAyatIndex];
      const audio = new Audio(currentAyat.audio["05"]);
      audio.setAttribute('data-ayat', currentAyatIndex);
  
      highlightCurrentAyat(currentAyatIndex);
  
      audio.play();
      audio.onended = () => {
        currentAyatIndex++;
        playNextAyat(ayat);
      };
    }
  
    function highlightCurrentAyat(ayatIndex) {
      const ayatElements = document.querySelectorAll('[data-ayat]');
      ayatElements.forEach(element => {
        if (element.dataset.ayat === (ayatIndex + 1).toString()) {
          element.classList.add('current-ayat');
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          element.classList.remove('current-ayat');
        }
      });
    }
  
    function toggleAyat(ayat, tafsir, button, container) {
        if (container.classList.contains("hidden")) {
            displayAyatWithTafsir(ayat, tafsir, container);
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Ayat';
            container.classList.remove("hidden");
        } else {
            container.innerHTML = "";
            button.innerHTML = '<i class="fas fa-eye"></i> Ayat';
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
        const batchSize = 10;
        let currentIndex = 0;
      
        function loadMoreAyat() {
          const fragment = document.createDocumentFragment();
          const endIndex = Math.min(currentIndex + batchSize, ayat.length);
      
          for (let i = currentIndex; i < endIndex; i++) {
            const a = ayat[i];
            const div = document.createElement("div");
            div.className = "border-b border-gray-200 dark:border-gray-700 pb-4";
            div.setAttribute("data-ayat", a.nomorAyat);
            div.innerHTML = `
              <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-semibold">${a.nomorAyat}.</span>
                <div>
                   <button class="play-audio-btn text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-2" data-audio="${a.audio["05"]}">
                    <i class="fas fa-play"></i>
                    </button>
                    <a href="${a.audio["05"]}" target="_blank" class="text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-2">
                    <i class="fa-solid fa-file-audio"></i>
                    </a>
                    <button class="download-image-btn text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    <i class="fas fa-download"></i>
                    </button>
                </div>
              </div>
              <p class="text-right text-2xl mb-5 mt-5 font-arabic">${a.teksArab}</p>
              <p class="mb-1 text-lg">${a.teksLatin}</p>
              <p class="text-gray-600 dark:text-gray-400">${a.teksIndonesia}</p>
              <button class="toggle-tafsir-btn mt-2 text-primary-600 dark:text-primary-400 hover:underline">
              Show Tafsir <i class="fas fa-chevron-down ml-1"></i>
              </button>
              <div class="tafsir-container hidden mt-2">
                <p class="text-gray-600 dark:text-gray-400">
                  ${tafsir[i] ? tafsir[i].teks : 'Tafsir tidak tersedia'}
                </p>
                <button class="copy-tafsir-btn mt-2 bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors duration-200">
                  <i class="fas fa-copy"> </i> Copy Tafsir
                </button>
              </div>
            `;
            fragment.appendChild(div);
          }
      
          ayatList.appendChild(fragment);
      
          currentIndex = endIndex;
      
          if (currentIndex < ayat.length) {
            const options = {
              root: null,
              rootMargin: "0px",
              threshold: 0.1
            };
      
            const observer = new IntersectionObserver((entries) => {
              if (entries[0].isIntersecting) {
                observer.unobserve(entries[0].target);
                loadMoreAyat();
              }
            }, options);
      
            observer.observe(ayatList.lastElementChild);
          }
      
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
        }
      
        loadMoreAyat();
      }
      
      function downloadAyatImageForTikTok(ayatElement, ayatNumber) {
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '1080px';
        tempDiv.style.height = '1920px';
        tempDiv.style.backgroundColor = 'black';
        tempDiv.style.color = 'white';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.display = 'flex';
        tempDiv.style.flexDirection = 'column';
        tempDiv.style.justifyContent = 'center';
        tempDiv.style.alignItems = 'center';
        tempDiv.style.padding = '50px';
        tempDiv.style.boxSizing = 'border-box';
      
        // Konten wrapper dengan margin yang lebih lebar
        const contentWrapper = document.createElement('div');
        contentWrapper.style.width = '100%';
        contentWrapper.style.maxWidth = '800px'; // Memperlebar margin
        contentWrapper.style.margin = '0 auto';
      
        // Judul
        const title = document.createElement('h1');
        title.textContent = `${currentSurah.namaLatin} : Ayat ${ayatNumber}`;
        title.style.textAlign = 'center';
        title.style.marginBottom = '50px';
        title.style.fontSize = 'clamp(20px, 5vw, 40px)'; // Font size fleksibel
      
        // Teks Arab
        const arabicText = document.createElement('p');
        arabicText.textContent = ayatElement.querySelector('.font-arabic').textContent;
        arabicText.style.fontSize = 'clamp(25px, 7vw, 50px)'; // Font size fleksibel
        arabicText.style.fontFamily = '"Traditional Arabic", Arial';
        arabicText.style.textAlign = 'right';
        arabicText.style.direction = 'rtl';
        arabicText.style.marginBottom = '30px';
      
        // Teks Latin
        const latinText = document.createElement('p');
        latinText.textContent = ayatElement.querySelector('p:nth-of-type(2)').textContent;
        latinText.style.fontSize = 'clamp(18px, 3.5vw, 36px)'; // Font size fleksibel
        latinText.style.textAlign = 'left';
        latinText.style.marginBottom = '20px';
      
        // Teks Indonesia
        const indonesianText = document.createElement('p');
        indonesianText.textContent = ayatElement.querySelector('p:nth-of-type(3)').textContent;
        indonesianText.style.fontSize = 'clamp(16px, 3vw, 30px)'; // Font size fleksibel
        indonesianText.style.textAlign = 'left';
      
        // Gabungkan semua elemen
        contentWrapper.appendChild(title);
        contentWrapper.appendChild(arabicText);
        contentWrapper.appendChild(latinText);
        contentWrapper.appendChild(indonesianText);
        tempDiv.appendChild(contentWrapper);
      
        // Tambahkan div sementara ke body
        document.body.appendChild(tempDiv);
      
        // Gunakan html2canvas untuk mengonversi div menjadi gambar
        html2canvas(tempDiv, {
          width: 1080,
          height: 1920,
          scale: 1
        }).then(canvas => {
          // Hapus div sementara
          document.body.removeChild(tempDiv);
      
          // Unduh gambar
          const link = document.createElement('a');
          link.download = `${currentSurah.namaLatin}-Ayat-${ayatNumber}-TikTok.png`;
          link.href = canvas.toDataURL();
          link.click();
        });
      }
      
      function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lastY = y;
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, lastY);
            line = words[n] + ' ';
            lastY += lineHeight;
          } else {
            line = testLine;
          }
        }
        
        context.fillText(line, x, lastY);
        return lastY + lineHeight;
      }
      
      function measureTextHeight(context, text, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let height = 0;
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            height += lineHeight;
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        
        return height + lineHeight;
      }
      
      function copyTafsir(tafsirText) {
        navigator.clipboard.writeText(tafsirText).then(() => {
          alert('Tafsir berhasil disalin!');
        }).catch(err => {
          console.error('Gagal menyalin tafsir: ', err);
        });
      }
      
      // Fungsi playAyatAudio tetap sama
      

        function playAyatAudio(button) {
        const audioSrc = button.dataset.audio;

        if (currentAudio && currentAudio.src === audioSrc) {
            // Jika audio yang sama sedang diputar, pause atau resume
            if (currentAudio.paused) {
            currentAudio.play();
            button.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
            currentAudio.pause();
            button.innerHTML = '<i class="fas fa-play"></i>';
            }
        } else {
            // Jika audio berbeda atau belum ada yang diputar
            if (currentAudio) {
            currentAudio.pause();
            const prevButton = document.querySelector(`[data-audio="${currentAudio.src}"]`);
            if (prevButton) {
                prevButton.innerHTML = '<i class="fas fa-play"></i>';
            }
            }

            currentAudio = new Audio(audioSrc);
            currentAudio.play();
            button.innerHTML = '<i class="fas fa-pause"></i>';

            currentAudio.onended = () => {
            button.innerHTML = '<i class="fas fa-play"></i>';
            currentAudio = null;
            };
        }
        }
    
        function toggleTafsirPerAyat(button) {
            const tafsirContainer = button.nextElementSibling;
            const chevronIcon = button.querySelector('i');
          
            if (tafsirContainer.classList.contains("hidden")) {
              tafsirContainer.classList.remove("hidden");
              button.innerHTML = `Hide Tafsir <i class="fas fa-chevron-up ml-1"></i>`;
            } else {
              tafsirContainer.classList.add("hidden");
              button.innerHTML = `Show Tafsir <i class="fas fa-chevron-down ml-1"></i>`;
            }
          }
  });
