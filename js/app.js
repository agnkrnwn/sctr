let currentMode = 'surah';
let isDarkMode = false;

// Event Listeners
document.getElementById('surahBtn').addEventListener('click', () => {
    currentMode = 'surah';
    loadSurahList();
});

document.getElementById('doaBtn').addEventListener('click', () => {
    currentMode = 'doa';
    loadDoaList();
});

document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);

document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (currentMode === 'surah') {
        loadSurahList(searchTerm);
    } else {
        loadDoaList(searchTerm);
    }
});

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeUI();
}

function updateDarkModeUI() {
    const icon = document.querySelector('#darkModeToggle i');
    icon.classList.toggle('fa-moon', !isDarkMode);
    icon.classList.toggle('fa-sun', isDarkMode);
}

function initDarkMode() {
    isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    }
    updateDarkModeUI();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
}

// Quran Functions
function loadSurahList(searchTerm = '') {
    fetch('surat/surat.json')
        .then(response => response.json())
        .then(data => {
            const listContent = document.getElementById('listContent');
            listContent.innerHTML = '<h3 class="text-xl font-semibold mb-4">Daftar Surah</h3>';
            const surahList = document.createElement('ul');
            surahList.className = 'space-y-2';
            data.data.forEach(surah => {
                if (surah.namaLatin.toLowerCase().includes(searchTerm)) {
                    const listItem = document.createElement('li');
                    listItem.className = 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors';
                    listItem.innerHTML = `${surah.nomor}. ${surah.namaLatin}`;
                    listItem.onclick = () => loadSurah(surah.nomor);
                    surahList.appendChild(listItem);
                }
            });
            listContent.appendChild(surahList);
        });
}

function loadSurah(surahNumber) {
    Promise.all([
        fetch(`surat/${surahNumber}.json`),
        fetch(`tafsir/${surahNumber}.json`)
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([surahData, tafsirData]) => {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <h2 class="text-3xl font-bold mb-4">${surahData.data.namaLatin}</h2>
            <p class="text-lg mb-2">${surahData.data.arti}</p>
            <p class="mb-4">${surahData.data.deskripsi}</p>
            <div id="audioPlayer" class="mb-6"></div>
            <button id="autoPlayBtn" class="mb-4 p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
                Mulai Pemutaran Otomatis
            </button>
            <div id="ayatList"></div>
        `;
        
        setupAudioPlayer(surahData.data.audioFull);
        displayAyat(surahData.data.ayat, tafsirData.data.tafsir);
        
        document.getElementById('autoPlayBtn').addEventListener('click', () => startAutoPlay(surahData.data.ayat));
    });
}
function setupAudioPlayer(audioData) {
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSelect = document.createElement('select');
    audioSelect.className = 'w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600';
    Object.entries(audioData).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = `Qari ${key}`;
        audioSelect.appendChild(option);
    });
    const audioContainer = document.createElement('div');
    audioContainer.className = 'flex items-center space-x-2';
    const playBtn = document.createElement('button');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.className = 'p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors';
    audioContainer.appendChild(playBtn);
    audioContainer.appendChild(audioSelect);
    audioPlayer.appendChild(audioContainer);

    let audio = new Audio();
    playBtn.onclick = () => {
        if (audio.paused) {
            audio.src = audioSelect.value;
            audio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    audioSelect.onchange = () => {
        audio.src = audioSelect.value;
        if (!audio.paused) {
            audio.play();
        }
    };
}

function displayAyat(ayatData, tafsirData) {
    const ayatList = document.getElementById('ayatList');
    ayatList.innerHTML = ''; // Clear previous content

    ayatData.forEach((ayat, index) => {
        const ayatDiv = document.createElement('div');
        ayatDiv.className = 'mb-8 pb-6 border-b dark:border-gray-700 transition-colors';
        ayatDiv.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h5 class="text-xl font-semibold">Ayat ${ayat.nomorAyat}</h5>
                <button class="ayatAudioBtn p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <p class="text-right arabic-text mb-4">${ayat.teksArab}</p>
            <p class="mb-2 text-gray-600 dark:text-gray-400">${ayat.teksLatin}</p>
            <p class="mb-4">${ayat.teksIndonesia}</p>
            <button class="tafsirBtn p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                Tampilkan Tafsir
            </button>
            <div class="tafsirContent hidden mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                ${formatTafsir(tafsirData[index].teks)}
            </div>
        `;
        ayatList.appendChild(ayatDiv);

        const audioBtn = ayatDiv.querySelector('.ayatAudioBtn');
        const audio = new Audio(ayat.audio['01']);
        audioBtn.onclick = () => {
            if (audio.paused) {
                audio.play();
                audioBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                audioBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        };

        audio.onended = () => {
            audioBtn.innerHTML = '<i class="fas fa-play"></i>';
        };

        const tafsirBtn = ayatDiv.querySelector('.tafsirBtn');
        const tafsirContent = ayatDiv.querySelector('.tafsirContent');
        tafsirBtn.onclick = () => {
            tafsirContent.classList.toggle('hidden');
            tafsirBtn.textContent = tafsirContent.classList.contains('hidden') ? 'Tampilkan Tafsir' : 'Sembunyikan Tafsir';
        };
    });
}

function formatTafsir(tafsirText) {
    // Split the tafsir text into paragraphs
    const paragraphs = tafsirText.split('\n\n');
    
    // Wrap each paragraph in a <p> tag and add margin
    return paragraphs.map(p => `<p class="mb-4">${p}</p>`).join('');
}

function startAutoPlay(ayatData) {
    const ayatList = document.querySelectorAll('#ayatList > div');
    let currentAyatIndex = 0;

    function playNextAyat() {
        if (currentAyatIndex < ayatList.length) {
            const ayatDiv = ayatList[currentAyatIndex];
            const audioBtn = ayatDiv.querySelector('.ayatAudioBtn');
            ayatDiv.scrollIntoView({ behavior: 'smooth' });
            highlightAyat(ayatDiv, true);
            
            const audio = new Audio(ayatData[currentAyatIndex].audio['01']);
            audio.play();
            
            audio.onended = () => {
                highlightAyat(ayatDiv, false);
                currentAyatIndex++;
                playNextAyat();
            };
        }
    }

    playNextAyat();
}

function highlightAyat(ayatDiv, highlight) {
    if (highlight) {
        ayatDiv.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
    } else {
        ayatDiv.classList.remove('bg-yellow-100', 'dark:bg-yellow-900');
    }
}

// Doa Functions
function loadDoaList(searchTerm = '') {
    fetch('doa/doa.json')
        .then(response => response.json())
        .then(data => {
            const listContent = document.getElementById('listContent');
            listContent.innerHTML = '<h3 class="text-xl font-semibold mb-4">Daftar Doa</h3>';
            const doaList = document.createElement('ul');
            doaList.className = 'space-y-2';
            data.forEach(doa => {
                if (doa.nama.toLowerCase().includes(searchTerm)) {
                    const listItem = document.createElement('li');
                    listItem.className = 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors';
                    listItem.innerHTML = doa.nama;
                    listItem.onclick = () => loadDoa(doa);
                    doaList.appendChild(listItem);
                }
            });
            listContent.appendChild(doaList);
        });
}

function loadDoa(doa) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h2 class="text-3xl font-bold mb-4">${doa.nama}</h2>
        <p class="mb-2"><strong>Grup:</strong> ${doa.grup}</p>
        <p class="text-2xl mb-2 text-right arabic-text">${doa.ar}</p>
        <p class="mb-2">${doa.tr}</p>
        <p class="mb-4">${doa.idn}</p>
        <p><strong>Tentang:</strong> ${doa.tentang}</p>
    `;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    loadSurahList();
});