const reciterSelect = document.getElementById('reciter');
const chapterSelect = document.getElementById('chapter');
const ayaInput = document.getElementById('aya');
const ayaImage = document.getElementById('ayaImage');
const ayaAudio = document.getElementById('ayaAudio');
const downloadAudio = document.getElementById('downloadAudio');
const downloadImage = document.getElementById('downloadImage');

let chapterAyaCounts = {};

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
    const aya = ayaInput.value;
    const maxAya = chapterAyaCounts[chapterSelect.value];

    if (parseInt(aya) > maxAya) {
        alert(`Surah ini hanya memiliki ${maxAya} ayat. Silakan masukkan nomor ayat yang valid.`);
        ayaInput.value = maxAya;
        return;
    }

    const paddedAya = aya.padStart(3, '0');

    const audioUrl = `https://everyayah.com/data/${reciter}/${chapter}${paddedAya}.mp3`;
    const imageUrl = `https://everyayah.com/data/images_png/${chapter.replace(/^0+/, '')}_${aya.replace(/^0+/, '')}.png`;

    ayaAudio.src = audioUrl;
    ayaImage.src = imageUrl;
    downloadAudio.href = audioUrl;
    downloadImage.href = imageUrl;
}

function updateAyaLimit() {
    const maxAya = chapterAyaCounts[chapterSelect.value];
    ayaInput.max = maxAya;
    ayaInput.value = Math.min(ayaInput.value, maxAya);
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