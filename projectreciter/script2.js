const reciterSelect = document.getElementById('reciter');
const chapterSelect = document.getElementById('chapter');
const ayaInput = document.getElementById('aya');
const ayaImage = document.getElementById('ayaImage');
const ayaAudio = document.getElementById('ayaAudio');
const downloadAudio = document.getElementById('downloadAudio');
const downloadImage = document.getElementById('downloadImage');
const autoplayBtn = document.getElementById('autoplay');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const darkModeToggle = document.getElementById('darkModeToggle');

let chapterAyaCounts = {};
let isAutoplay = false;

function populateSelect(select, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
        
        if (select.id === 'chapter') {
            chapterAyaCounts[option.value] = option.ayaCount;
        }
    });
}

function updateMedia() {
    const reciter = reciterSelect.value;
    const chapter = chapterSelect.value.padStart(3, '0');
    const aya = ayaInput.value.padStart(3, '0');
    const maxAya = chapterAyaCounts[chapterSelect.value];

    if (parseInt(aya) > maxAya) {
        alert(`Surah ini hanya memiliki ${maxAya} ayat. Silakan masukkan nomor ayat yang valid.`);
        ayaInput.value = maxAya;
        return;
    }

    const audioUrl = `https://everyayah.com/data/${reciter}/${chapter}${aya}.mp3`;
    const imageUrl = `https://everyayah.com/data/images_png/${chapter.replace(/^0+/, '')}_${aya.replace(/^0+/, '')}.png`;

    ayaAudio.src = audioUrl;
    ayaImage.src = imageUrl;
    downloadAudio.href = audioUrl;
    downloadImage.href = imageUrl;

    ayaAudio.onloadedmetadata = function() {
        if (isAutoplay || document.activeElement === nextBtn || document.activeElement === prevBtn) {
            ayaAudio.play();
        }
    };
}

function updateAyaLimit() {
    const maxAya = chapterAyaCounts[chapterSelect.value];
    ayaInput.max = maxAya;
    ayaInput.value = Math.min(ayaInput.value, maxAya);
}

function nextAya() {
    const currentAya = parseInt(ayaInput.value);
    const maxAya = chapterAyaCounts[chapterSelect.value];
    if (currentAya < maxAya) {
        ayaInput.value = currentAya + 1;
        updateMedia();
    } else {
        const currentChapter = parseInt(chapterSelect.value);
        if (currentChapter < 114) {
            chapterSelect.value = (currentChapter + 1).toString();
            ayaInput.value = '1';
            updateAyaLimit();
            updateMedia();
        } else if (isAutoplay) {
            stopAutoplay();
        }
    }
}

function prevAya() {
    const currentAya = parseInt(ayaInput.value);
    if (currentAya > 1) {
        ayaInput.value = currentAya - 1;
        updateMedia();
    } else {
        const currentChapter = parseInt(chapterSelect.value);
        if (currentChapter > 1) {
            chapterSelect.value = (currentChapter - 1).toString();
            updateAyaLimit();
            ayaInput.value = chapterAyaCounts[chapterSelect.value];
            updateMedia();
        }
    }
}

function toggleAutoplay() {
    isAutoplay = !isAutoplay;
    autoplayBtn.classList.toggle('bg-primary-500');
    autoplayBtn.classList.toggle('dark:bg-primary-600');
    autoplayBtn.classList.toggle('bg-gray-300');
    autoplayBtn.classList.toggle('dark:bg-gray-600');
    autoplayBtn.classList.toggle('text-white');
    autoplayBtn.classList.toggle('text-gray-700');
    autoplayBtn.classList.toggle('dark:text-gray-300');
    if (isAutoplay) {
        ayaAudio.addEventListener('ended', nextAya);
        if (ayaAudio.paused) {
            ayaAudio.play();
        }
    } else {
        ayaAudio.removeEventListener('ended', nextAya);
    }
}

function startPlayback() {
    ayaAudio.play();
}

function stopPlayback() {
    ayaAudio.pause();
    ayaAudio.currentTime = 0;
}

function stopAutoplay() {
    isAutoplay = false;
    autoplayBtn.classList.remove('bg-primary-500', 'dark:bg-primary-600', 'text-white');
    autoplayBtn.classList.add('bg-gray-300', 'dark:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
    ayaAudio.removeEventListener('ended', nextAya);
    ayaAudio.pause();
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// Fetch JSON data and populate dropdowns
fetch('quran_data.json')
    .then(response => response.json())
    .then(data => {
        populateSelect(reciterSelect, data.reciters);
        populateSelect(chapterSelect, data.chapters);
        updateAyaLimit();
        updateMedia(); // Initial update
    })
    .catch(error => console.error('Error loading data:', error));

reciterSelect.addEventListener('change', updateMedia);
chapterSelect.addEventListener('change', () => {
    updateAyaLimit();
    updateMedia();
});
ayaInput.addEventListener('change', updateMedia);
autoplayBtn.addEventListener('click', toggleAutoplay);
prevBtn.addEventListener('click', prevAya);
nextBtn.addEventListener('click', nextAya);
startBtn.addEventListener('click', startPlayback);
stopBtn.addEventListener('click', stopPlayback);
darkModeToggle.addEventListener('click', toggleDarkMode);

// Check dark mode preference when page loads
if (localStorage.getItem('darkMode') === 'true' || 
    (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}