export function loadSurahList(searchTerm = '') {
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

export function loadSurah(surahNumber) {
    fetch(`surat/${surahNumber}.json`)
        .then(response => response.json())
        .then(data => {
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <h2 class="text-3xl font-bold mb-4">${data.data.namaLatin}</h2>
                <p class="text-lg mb-2">${data.data.arti}</p>
                <p class="mb-4">${data.data.deskripsi}</p>
                <div id="audioPlayer" class="mb-6"></div>
                <div id="ayatList"></div>
            `;
            
            setupAudioPlayer(data.data.audioFull);
            displayAyat(data.data.ayat);
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
}

function displayAyat(ayatData) {
    const ayatList = document.getElementById('ayatList');
    ayatData.forEach(ayat => {
        const ayatDiv = document.createElement('div');
        ayatDiv.className = 'mb-6 pb-4 border-b dark:border-gray-700 transition-colors';
        ayatDiv.innerHTML = `
            <h5 class="text-xl font-semibold mb-2">Ayat ${ayat.nomorAyat}</h5>
            <p class="text-2xl mb-2 text-right">${ayat.teksArab}</p>
            <p class="mb-2">${ayat.teksLatin}</p>
            <p class="mb-2">${ayat.teksIndonesia}</p>
            <div class="flex items-center space-x-2">
                <button class="ayatAudioBtn p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                    <i class="fas fa-play"></i>
                </button>
                <button class="tafsirBtn p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                    Tafsir
                </button>
            </div>
        `;
        ayatList.appendChild(ayatDiv);
    });
}