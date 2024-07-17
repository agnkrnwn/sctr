let currentSurah = 1;
let surahData = new Map();
let surahListData = [];
let currentAudio = null;
let isPlaying = false;

function changeFont(fontFamily) {
    document.querySelectorAll('.arabic').forEach(el => {
        el.style.fontFamily = fontFamily;
    });
    // Simpan preferensi font ke localStorage
    localStorage.setItem('selectedFont', fontFamily);
}

let isSidebarOpen = false;

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('-translate-x-full');
    isSidebarOpen = true;
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('-translate-x-full');
    isSidebarOpen = false;
}

function toggleSidebar() {
    if (isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// Use sessionStorage instead of localStorage for temporary caching
const surahCache = JSON.parse(sessionStorage.getItem('surahCache')) || {};

async function loadSurahListData() {
    try {
        const response = await fetch('./suratbaru/surat.json');
        const jsonData = await response.json();
        // Correctly access the 'data' property of the JSON
        surahListData = jsonData.data || [];
        if (!Array.isArray(surahListData)) {
            console.error('Surah list data is not an array:', surahListData);
            surahListData = [];
        }
        createSurahList();
    } catch (error) {
        console.error('Error loading surah list data:', error);
    }
}


async function loadSurah(surahNumber) {
    if (!surahData.has(surahNumber)) {
        if (surahCache[surahNumber]) {
            surahData.set(surahNumber, surahCache[surahNumber]);
        } else {
            try {
                const response = await fetch(`./suratbaru/${surahNumber}.json`);
                const data = await response.json();
                surahData.set(surahNumber, data.data);
                
                // Only cache if there's space available
                try {
                    surahCache[surahNumber] = data.data;
                    sessionStorage.setItem('surahCache', JSON.stringify(surahCache));
                } catch (e) {
                    console.warn('Cache storage full. Skipping caching for this surah.');
                }
            } catch (error) {
                console.error(`Error loading surah ${surahNumber}:`, error);
                return;
            }
        }
    }
    const surah = surahData.get(surahNumber);
    if (surah) {
        renderSurah(surah);
        currentSurah = surahNumber;
        if (window.innerWidth < 768) { // Hanya tutup sidebar pada layar kecil (misalnya < 768px)
            closeSidebar();
        } 
    }
}

function renderSurah(surah) {
    document.getElementById('judul').textContent = surah.namaLatin ;
    document.getElementById('surahTitle').textContent = surah.nama;
    document.getElementById('surahSubtitle').textContent = surah.namaLatin;
    document.getElementById('bismillah').textContent = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';

    const ayatContainer = document.getElementById('ayatContainer');
    ayatContainer.innerHTML = '';

    const audioUrl = surah.audioFull['05'];
    setupAudio(audioUrl);

    const selectedFont = document.getElementById('fontSelector').value;
    ayatContainer.querySelectorAll('.arabic').forEach(el => {
        el.style.fontFamily = selectedFont;
    });

    surah.ayat.forEach(ayat => {
        const ayatDiv = document.createElement('div');
        ayatDiv.className = 'mb-4 flex justify-end items-center';
        ayatDiv.innerHTML = `
            <span class="ayat-number text-sm font-semi-bold text-gray-500 dark:text-gray-400 mx-1">﴾${ayat.nomorAyat}﴿</span>
            <span class="text-3xl arabic font-semi-bold leading-loose dark:text-white">${ayat.teksArab}</span>
        `;
        ayatContainer.appendChild(ayatDiv);
    });
}

function setupAudio(audioUrl) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeEventListener('ended', handleAudioEnd);
    }

    currentAudio = new Audio(audioUrl);
    currentAudio.addEventListener('ended', handleAudioEnd);

    const playAudioButton = document.getElementById('playAudio');
    playAudioButton.onclick = toggleAudio;

    updateAudioIcon();
}

function toggleAudio() {
    if (isPlaying) {
        currentAudio.pause();
    } else {
        currentAudio.play();
    }
    isPlaying = !isPlaying;
    updateAudioIcon();
}

function handleAudioEnd() {
    isPlaying = false;
    updateAudioIcon();
}

function updateAudioIcon() {
    const audioIcon = document.getElementById('audioIcon');
    audioIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function createSurahList() {
    const surahList = document.getElementById('surahList');
    surahList.innerHTML = '';
    
    if (surahListData.length === 0) {
        surahList.innerHTML = '<li class="px-4 py-2 text-gray-500 dark:text-gray-400">No surah data available</li>';
        return;
    }

    surahListData.forEach((surah, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center" onclick="loadSurah(${surah.nomor})">
                <div class="flex flex-col">
                    <span class="dark:text-white text-lg">${surah.nomor}. ${surah.nama}</span>
                    <span class="dark:text-gray-400 text-sm">${surah.namaLatin} - ${surah.jumlahAyat} Ayat</span>
                </div>
            </button>
        `;
        surahList.appendChild(li);
    });
}

function searchSurah() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const surahItems = document.querySelectorAll('#surahList li');
    surahItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getRandomSurahNumber() {
    return Math.floor(Math.random() * 114) + 1; // Menghasilkan angka acak antara 1 dan 114
}

document.addEventListener('DOMContentLoaded', function () {
    loadSurahListData();
    // loadSurah(1);
    const randomSurahNumber = getRandomSurahNumber();
    loadSurah(randomSurahNumber);
    closeSidebar(); 

    document.getElementById('searchInput').addEventListener('input', searchSurah);
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('scrollToTop').addEventListener('click', scrollToTop);

    window.addEventListener('scroll', function () {
        document.getElementById('scrollToTop').classList.toggle('hidden', window.pageYOffset <= 100);
    });

    // Atur font selector
    const fontSelector = document.getElementById('fontSelector');
    fontSelector.addEventListener('change', (e) => {
        changeFont(e.target.value);
    });

    // Muat font yang tersimpan dari localStorage
    const savedFont = localStorage.getItem('selectedFont');
    if (savedFont) {
        fontSelector.value = savedFont;
        changeFont(savedFont);
    }
});