let quranData;
let currentReciter = '';
let currentSurah = '';
let currentAyah = 0;
let audioElements = [];
let isPlaying = false;
let autoPlaySurah = false;

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.documentElement.classList.toggle('dark');
});

fetch('qurandata_updated.json')
    .then(response => response.json())
    .then(data => {
        quranData = data;
        populateSurahList();
        populateReciterSelect();
    });

document.getElementById('darkModeToggle').addEventListener('change', function () {
    document.body.classList.toggle('dark');
});

document.getElementById('jumpBtn').addEventListener('click', jumpToAyah);
document.getElementById('jumpToAyah').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        jumpToAyah();
    }
});

function jumpToAyah() {
    const ayahNumber = parseInt(document.getElementById('jumpToAyah').value);
    if (isNaN(ayahNumber) || ayahNumber < 1 || ayahNumber > audioElements.length) {
        alert('Nomor ayat tidak valid');
        return;
    }

    currentAyah = ayahNumber - 1;
    highlightAyah(currentAyah);
    document.getElementById(`ayah-${ayahNumber}`).scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (isPlaying) {
        audioElements[currentAyah].currentTime = 0;
        audioElements[currentAyah].play();
    }
}


function populateSurahList() {
    const surahList = document.getElementById('surahList');
    quranData.chapters.forEach(chapter => {
        const li = document.createElement('li');
        li.className = 'px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer';
        li.textContent = chapter.text;
        li.dataset.value = chapter.value;
        li.addEventListener('click', () => {
            selectSurah(chapter.value, chapter.text);
            document.getElementById('surahDropdownMenu').classList.add('hidden');
        });
        surahList.appendChild(li);
    });
}


function populateReciterSelect() {
    const select = document.getElementById('reciterSelect');
    quranData.reciters.forEach(reciter => {
        const option = document.createElement('option');
        option.value = reciter.value;
        option.textContent = reciter.text;
        select.appendChild(option);
    });
}

document.getElementById('reciterSelect').addEventListener('change', function (e) {
    currentReciter = e.target.value;
    if (currentSurah) displaySurah(currentSurah);
});

document.getElementById('autoPlaySurah').addEventListener('change', function (e) {
    autoPlaySurah = e.target.checked;
});

document.getElementById('surahSearch').addEventListener('input', searchSurah);

function searchSurah() {
    const searchTerm = document.getElementById('surahSearch').value.toLowerCase();
    const surahItems = document.querySelectorAll('#surahList li');

    surahItems.forEach(item => {
        const surahName = item.textContent.toLowerCase();
        if (surahName.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function selectSurah(value, text) {
    currentSurah = value;
    document.getElementById('surahDropdown').textContent = text;
    displaySurah(value);
}

function displaySurah(surahIndex) {
    if (!surahIndex) return;

    currentAyah = 0;
    const surah = quranData.chapters.find(ch => ch.value === surahIndex);
    const container = document.getElementById('ayahContainer');
    container.innerHTML = '';
    audioElements = [];

    surah.urls.forEach((ayah, index) => {
        const ayahDiv = document.createElement('div');
        ayahDiv.className = 'ayah';
        ayahDiv.id = `ayah-${index + 1}`;

        const jumpToAyahInput = document.getElementById('jumpToAyah');
        jumpToAyahInput.max = surah.urls.length;
        jumpToAyahInput.placeholder = `1-${surah.urls.length}`;

        const img = document.createElement('img');
        img.src = ayah.image_url;
        img.alt = `Surat ${surah.text}, Ayat ${ayah.aya}`;
        img.className = 'w-full h-auto cursor-pointer';
        img.addEventListener('click', () => playAyahAudio(index));
        ayahDiv.appendChild(img);

        if (currentReciter) {
            const audio = document.createElement('audio');
            audio.src = ayah.audio_urls[currentReciter];
            audioElements.push(audio);

            audio.addEventListener('ended', () => {
                if (isPlaying) playNext();
            });
        }

        container.appendChild(ayahDiv);
    });
}

function displaySurah(surahIndex) {
    if (!surahIndex) return;

    currentAyah = 0;
    const surah = quranData.chapters.find(ch => ch.value === surahIndex);
    const container = document.getElementById('ayahContainer');
    container.innerHTML = '';
    audioElements = [];

    surah.urls.forEach((ayah, index) => {
        const ayahDiv = document.createElement('div');
        ayahDiv.className = 'ayah mb-4'; // Hilangkan kelas card
        ayahDiv.id = `ayah-${index + 1}`;

        const jumpToAyahInput = document.getElementById('jumpToAyah');
        jumpToAyahInput.max = surah.urls.length;
        jumpToAyahInput.placeholder = `1-${surah.urls.length}`;

        const img = document.createElement('img');
        img.src = ayah.image_url;
        img.alt = `Surat ${surah.text}, Ayat ${ayah.aya}`;
        img.className = 'w-full h-auto cursor-pointer';
        img.addEventListener('click', () => playAyahAudio(index));
        ayahDiv.appendChild(img);

        if (currentReciter) {
            const audio = document.createElement('audio');
            audio.src = ayah.audio_urls[currentReciter];
            audioElements.push(audio);

            audio.addEventListener('ended', () => {
                if (isPlaying) playNext();
            });
        }

        container.appendChild(ayahDiv);
    });
}

function playAyahAudio(index) {
    if (isPlaying && currentAyah !== index) {
        audioElements[currentAyah].pause();
        audioElements[currentAyah].currentTime = 0;
    }
    currentAyah = index;
    highlightAyah(currentAyah);
    playAyah(currentAyah);
}

function highlightAyah(index) {
    document.querySelectorAll('.ayah').forEach((ayah, i) => {
        if (i === index) {
            ayah.classList.add('bg-primary-100', 'dark:bg-primary-100');
        } else {
            ayah.classList.remove('bg-primary-100', 'dark:bg-primary-100');
        }
    });
}

function playAyah(index) {
    audioElements.forEach((audio, i) => {
        if (i === index) {
            audio.currentTime = 0;
            audio.play();
            isPlaying = true;
            document.getElementById(`ayah-${index + 1}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    highlightAyah(index);
}

document.getElementById('playBtn').addEventListener('click', function() {
    if (isPlaying) {
        audioElements[currentAyah].pause();
        isPlaying = false;
    } else {
        playAyah(currentAyah);
    }
});

document.getElementById('pauseBtn').addEventListener('click', function() {
    if (isPlaying) {
        audioElements[currentAyah].pause();
        isPlaying = false;
    }
});



document.getElementById('prevBtn').addEventListener('click', playPrevious);
document.getElementById('playBtn').addEventListener('click', play);
document.getElementById('pauseBtn').addEventListener('click', pause);
document.getElementById('stopBtn').addEventListener('click', stop);
document.getElementById('nextBtn').addEventListener('click', playNext);

function play() {
    if (!audioElements.length) return;
    isPlaying = true;
    if (currentAyah >= audioElements.length) currentAyah = 0;
    playAyah(currentAyah);
}

function pause() {
    isPlaying = false;
    if (currentAyah < audioElements.length) {
        audioElements[currentAyah].pause();
    }
}

function stop() {
    isPlaying = false;
    audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    currentAyah = 0;
    highlightAyah(-1);
}

function playNext() {
    if (currentAyah < audioElements.length - 1) {
        audioElements[currentAyah].pause();
        currentAyah++;
        playAyah(currentAyah);
    } else if (autoPlaySurah) {
        playNextSurah();
    } else {
        stop();
    }
}

function playPrevious() {
    if (currentAyah > 0) {
        audioElements[currentAyah].pause();
        currentAyah--;
        playAyah(currentAyah);
    } else if (autoPlaySurah) {
        playPreviousSurah();
    }
}

function playNextSurah() {
    const currentSurahIndex = quranData.chapters.findIndex(ch => ch.value === currentSurah);
    if (currentSurahIndex < quranData.chapters.length - 1) {
        const nextSurah = quranData.chapters[currentSurahIndex + 1];
        selectSurah(nextSurah.value, nextSurah.text);
        play();
    }
}

function playPreviousSurah() {
    const currentSurahIndex = quranData.chapters.findIndex(ch => ch.value === currentSurah);
    if (currentSurahIndex > 0) {
        const prevSurah = quranData.chapters[currentSurahIndex - 1];
        selectSurah(prevSurah.value, prevSurah.text);
        play();
    }
}

// Perbaikan untuk dropdown surat
document.getElementById('surahDropdown').addEventListener('click', function(event) {
    event.stopPropagation();
    const dropdownMenu = document.getElementById('surahDropdownMenu');
    dropdownMenu.classList.toggle('hidden');
});

document.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('surahDropdownMenu');
    const dropdownButton = document.getElementById('surahDropdown');
    if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
    }
});