const reciterSelect = document.getElementById('reciter');
const surahList = document.getElementById('surah-list');
const ayahImage = document.getElementById('ayah-image');
const currentSurah = document.getElementById('current-surah');
const prevBtn = document.getElementById('prev');
const playPauseBtn = document.getElementById('play-pause');
const nextBtn = document.getElementById('next');
const audioPlayer = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const playFullSurahBtn = document.getElementById('play-full-surah');
const autoplayCheckbox = document.getElementById('autoplay');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');

let chapterAyaCounts = {};
let currentChapter = 1;
let currentAya = 1;
let isPlayingFullSurah = false;
let isFullSurahMode = false;

function searchSurah() {
    const searchTerm = document.getElementById('surah-search').value.toLowerCase();
    const surahItems = surahList.getElementsByTagName('li');
    
    for (let i = 0; i < surahItems.length; i++) {
        const surahText = surahItems[i].textContent.toLowerCase();
        if (surahText.includes(searchTerm)) {
            surahItems[i].style.display = "";
        } else {
            surahItems[i].style.display = "none";
        }
    }
}

function resetSearch() {
    document.getElementById('surah-search').value = '';
    searchSurah();
}

function populateSelect(select, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
    });
}

function populateSurahList(chapters) {
    chapters.forEach(chapter => {
        const li = document.createElement('li');
        li.textContent = `${chapter.value}. ${chapter.text}`;
        li.setAttribute('data-surah-name', chapter.text.toLowerCase());
        li.classList.add('cursor-pointer', 'hover:bg-gray-200', 'dark:hover:bg-gray-700', 'p-2', 'rounded');
        li.addEventListener('click', () => {
            currentChapter = parseInt(chapter.value);
            currentAya = 1;
            updateMedia();
        });
        surahList.appendChild(li);
        chapterAyaCounts[chapter.value] = chapter.ayaCount;
    });
}

function updateMedia() {
    const reciter = reciterSelect.value;
    const chapter = currentChapter.toString().padStart(3, '0');
    const aya = currentAya.toString().padStart(3, '0');

    const audioUrl = `https://everyayah.com/data/${reciter}/${chapter}${aya}.mp3`;
    const imageUrl = `https://everyayah.com/data/images_png/${chapter.replace(/^0+/, '')}_${aya.replace(/^0+/, '')}.png`;
    //https://everyayah.com/data/quranpngs/

    // Preload image
    const img = new Image();
    img.onload = function() {
        ayahImage.src = this.src;
        ayahImage.alt = `Surah ${currentChapter}, Ayah ${currentAya}`;
    };
    img.onerror = function() {
        console.error('Error loading image');
        ayahImage.src = 'path/to/fallback/image.png'; // Provide a fallback image
        ayahImage.alt = 'Image not available';
    };
    img.src = imageUrl;

    // Update audio source
    audioPlayer.src = audioUrl;

    // Update surah name display
    const surahName = getSurahName(currentChapter);
    currentSurah.textContent = `${surahName} - No: ${currentAya}`;

    // Play audio if needed
    // Play audio if needed
    if (isPlayingFullSurah || (autoplayCheckbox.checked && !isFullSurahMode)) {
        audioPlayer.play().catch(e => console.error('Error playing audio:', e));
    } else {
        audioPlayer.pause();
    }

    // Update other UI elements if necessary
    updateUIElements();
}

function updateUIElements() {
    // Update any other UI elements that depend on the current surah/ayah
    // For example, highlighting the current surah in the list, updating navigation buttons, etc.
}

let quranData = null;

function getSurahName(chapterNumber) {
    if (quranData && quranData.chapters) {
        const chapter = quranData.chapters.find(ch => parseInt(ch.value) === chapterNumber);
        return chapter ? chapter.text : `Chapter ${chapterNumber}`;
    }
    return `Chapter ${chapterNumber}`;
}

// Modify the fetch function
fetch('quran_data.json')
    .then(response => response.json())
    .then(data => {
        quranData = data;
        populateSelect(reciterSelect, data.reciters);
        populateSurahList(data.chapters);
        updateMedia();
    })
    .catch(error => console.error('Error loading data:', error));

    function nextAya() {
        const maxAya = chapterAyaCounts[currentChapter];
        if (currentAya < maxAya) {
            currentAya++;
        } else {
            if (isFullSurahMode) {
                // Jika mode full surah aktif, hentikan pemutaran
                isFullSurahMode = false;
                isPlayingFullSurah = false;
                updateFullSurahButtonStyle();
                playPause(); // Ini akan menghentikan audio
                return;
            } else if (autoplayCheckbox.checked && currentChapter < 114) {
                // Jika autoplay aktif dan bukan surah terakhir, lanjut ke surah berikutnya
                currentChapter++;
                currentAya = 1;
            } else {
                // Jika tidak ada kondisi di atas terpenuhi, hentikan pemutaran
                isPlayingFullSurah = false;
                playPause(); // Ini akan menghentikan audio
                return;
            }
        }
        updateMedia();
    }

function prevAya() {
    if (currentAya > 1) {
        currentAya--;
    } else if (currentChapter > 1) {
        currentChapter--;
        currentAya = chapterAyaCounts[currentChapter];
    }
    updateMedia();
}

function updateProgressBar() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    duration.textContent = formatTime(audioPlayer.duration);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function playPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>';
    }
}

function playFullSurah() {
    isFullSurahMode = !isFullSurahMode;
    isPlayingFullSurah = isFullSurahMode;
    if (isFullSurahMode) {
        currentAya = 1; // Mulai dari awal surah saat ini
    }
    updateFullSurahButtonStyle();
    updateMedia();
}

function updateFullSurahButtonStyle() {
    if (isFullSurahMode) {
        playFullSurahBtn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-white');
        playFullSurahBtn.classList.add('bg-blue-500', 'text-white');
    } else {
        playFullSurahBtn.classList.remove('bg-blue-500', 'text-white');
        playFullSurahBtn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-white');
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('hidden');
    if (sidebar.classList.contains('hidden')) {
        resetSearch();
    }
}

// Event listeners
reciterSelect.addEventListener('change', updateMedia);
playPauseBtn.addEventListener('click', playPause);
prevBtn.addEventListener('click', prevAya);
nextBtn.addEventListener('click', nextAya);
audioPlayer.addEventListener('timeupdate', updateProgressBar);
document.getElementById('surah-search').addEventListener('input', searchSurah);

audioPlayer.addEventListener('ended', () => {
    if (isFullSurahMode || autoplayCheckbox.checked) {
        nextAya();
    }
});

autoplayCheckbox.addEventListener('change', function() {
    if (this.checked) {
        isPlayingFullSurah = true;
    } else {
        isPlayingFullSurah = isFullSurahMode;
    }
});

playFullSurahBtn.addEventListener('click', playFullSurah);
toggleSidebarBtn.addEventListener('click', toggleSidebar);

// Fetch JSON data and populate dropdowns
fetch('quran_data.json')
    .then(response => response.json())
    .then(data => {
        populateSelect(reciterSelect, data.reciters);
        populateSurahList(data.chapters);
        updateMedia();
    })
    .catch(error => console.error('Error loading data:', error));

updateFullSurahButtonStyle();