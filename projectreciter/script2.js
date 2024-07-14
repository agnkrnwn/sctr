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
const toggleViewBtn = document.getElementById('toggleView');
const allAyatContainer = document.getElementById('allAyatContainer');

let chapterAyaCounts = {};
let isAutoplay = false;
let isSingleAyatView = true;

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
    const imageUrl = `https://everyayah.com/data/quranpngs/${chapter.replace(/^0+/, '')}_${aya.replace(/^0+/, '')}.png`;

    ayaAudio.src = audioUrl;
    ayaImage.src = imageUrl;
    downloadAudio.href = audioUrl;
    downloadImage.href = imageUrl;

    ayaAudio.onloadedmetadata = function() {
        if (isAutoplay || document.activeElement === nextBtn || document.activeElement === prevBtn) {
            ayaAudio.play();
        }
    };

    if (isSingleAyatView) {
        document.getElementById('ayatgambar').classList.remove('hidden');
        allAyatContainer.classList.add('hidden');
    } else {
        document.getElementById('ayatgambar').classList.add('hidden');
        allAyatContainer.classList.remove('hidden');
        loadAllAyat();
    }
}

function updateAyaLimit() {
    const maxAya = chapterAyaCounts[chapterSelect.value];
    ayaInput.max = maxAya;
    ayaInput.value = Math.min(ayaInput.value, maxAya);
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
    if (!isSingleAyatView) {
        highlightCurrentAya();
    }
    
    // Efek visual saat tombol ditekan
    prevBtn.classList.add('bg-primary-700', 'dark:bg-primary-800');
    setTimeout(() => {
        prevBtn.classList.remove('bg-primary-700', 'dark:bg-primary-800');
    }, 200);
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
    if (!isSingleAyatView) {
        highlightCurrentAya();
    }
    
    // Efek visual saat tombol ditekan
    nextBtn.classList.add('bg-primary-700', 'dark:bg-primary-800');
    setTimeout(() => {
        nextBtn.classList.remove('bg-primary-700', 'dark:bg-primary-800');
    }, 200);
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
    startBtn.classList.add('bg-primary-700', 'dark:bg-primary-800');
    setTimeout(() => {
        startBtn.classList.remove('bg-primary-700', 'dark:bg-primary-800');
    }, 200);
}

function stopPlayback() {
    ayaAudio.pause();
    ayaAudio.currentTime = 0;
    stopBtn.classList.add('bg-primary-700', 'dark:bg-primary-800');
    setTimeout(() => {
        stopBtn.classList.remove('bg-primary-700', 'dark:bg-primary-800');
    }, 200);
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

function toggleView() {
    isSingleAyatView = !isSingleAyatView;
    if (isSingleAyatView) {
        allAyatContainer.classList.add('hidden');
        document.getElementById('ayatgambar').classList.remove('hidden');
    } else {
        allAyatContainer.classList.remove('hidden');
        document.getElementById('ayatgambar').classList.add('hidden');
        loadAllAyat();
    }
    toggleViewBtn.classList.add('bg-primary-700', 'dark:bg-primary-800');
    setTimeout(() => {
        toggleViewBtn.classList.remove('bg-primary-700', 'dark:bg-primary-800');
    }, 200);
}

function loadAllAyat() {
    if (isSingleAyatView) return;

    const chapter = chapterSelect.value.padStart(3, '0');
    const maxAya = chapterAyaCounts[chapterSelect.value];
    
    allAyatContainer.innerHTML = ''; // Clear previous content
    
    for (let i = 1; i <= maxAya; i++) {
        const aya = i.toString().padStart(3, '0');
        const imageUrl = `https://everyayah.com/data/quranpngs/${chapter.replace(/^0+/, '')}_${aya.replace(/^0+/, '')}.png`;
        
        const ayaDiv = document.createElement('div');
        ayaDiv.id = `aya-${i}`;
        ayaDiv.classList.add('mb-4');
        
        const ayaImg = document.createElement('img');
        ayaImg.src = imageUrl;
        ayaImg.alt = `Aya ${i}`;
        ayaImg.classList.add('w-full', 'h-auto', 'rounded-lg');
        
        ayaDiv.appendChild(ayaImg);
        allAyatContainer.appendChild(ayaDiv);
    }
    
    highlightCurrentAya();
}

function highlightCurrentAya() {
    const currentAya = parseInt(ayaInput.value);
    const allAyat = allAyatContainer.children;
    
    for (let i = 0; i < allAyat.length; i++) {
        if (i + 1 === currentAya) {
            allAyat[i].classList.add('bg-primary-100', 'bg-opacity-70', 'rounded-lg', 'p-2');
            allAyat[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            allAyat[i].classList.remove('bg-primary-100', 'bg-opacity-70', 'rounded-lg', 'p-2');
        }
    }
}

function setupChapterSearch() {
    const chapterSearch = document.getElementById('chapterSearch');
    const chapterSelect = document.getElementById('chapter');
    const originalOptions = Array.from(chapterSelect.options);

    chapterSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredOptions = originalOptions.filter(option => 
            option.text.toLowerCase().includes(searchTerm)
        );

        chapterSelect.innerHTML = '';
        filteredOptions.forEach(option => chapterSelect.add(option.cloneNode(true)));

        if (filteredOptions.length > 0) {
            chapterSelect.selectedIndex = 0;
            updateAyaLimit();
            updateMedia();
        }
    });
}

// Call this function after populating the chapter select
// Add this line in the fetch().then() block:
//setupChapterSearch();


// Fetch JSON data and populate dropdowns
fetch('quran_data.json')
    .then(response => response.json())
    .then(data => {
        populateSelect(reciterSelect, data.reciters);
        populateSelect(chapterSelect, data.chapters);
        updateAyaLimit();
        updateMedia(); // Initial update
       setupChapterSearch(); // Set up chapter search
    })
    .catch(error => console.error('Error loading data:', error));

// Event listeners
reciterSelect.addEventListener('change', updateMedia);

chapterSelect.addEventListener('change', () => {
    updateAyaLimit();
    ayaInput.value = '1'; // Reset to first ayah when changing chapter
    updateMedia();
});


ayaInput.addEventListener('change', () => {
    updateMedia();
    if (!isSingleAyatView) {
        highlightCurrentAya();
    }
});
autoplayBtn.addEventListener('click', toggleAutoplay);
prevBtn.addEventListener('click', prevAya);
nextBtn.addEventListener('click', nextAya);
startBtn.addEventListener('click', startPlayback);
stopBtn.addEventListener('click', stopPlayback);
darkModeToggle.addEventListener('click', toggleDarkMode);
toggleViewBtn.addEventListener('click', toggleView);

// Check dark mode preference when page loads
if (localStorage.getItem('darkMode') === 'true' || 
    (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}