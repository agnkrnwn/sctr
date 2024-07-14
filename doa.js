let allDoas = [];
let categories = new Set();

async function fetchAndDisplayDoas() {
    try {
        const response = await fetch('./doa/doa.json');
        allDoas = await response.json();
        categories = new Set(allDoas.map(doa => doa.grup));
        populateCategoryList();
        displayDoas(allDoas);
    } catch (error) {
        console.error('Error fetching doa data:', error);
        document.getElementById('doaList').innerHTML = '<p class="text-red-500 text-center">Gagal memuat data doa. Silakan coba lagi nanti.</p>';
    }
}

function populateCategoryList() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '<li class="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400" onclick="filterByCategory(\'all\')">Semua Kategori</li>';
    categories.forEach(category => {
        categoryList.innerHTML += `<li class="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400" onclick="filterByCategory('${category}')">${category}</li>`;
    });
}

function displayDoas(doas) {
    const doaList = document.getElementById('doaList');
    doaList.innerHTML = '';
    doas.forEach(doa => {
        doaList.innerHTML += `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition duration-300" onclick="showDoaDetail(${doa.id})">
                <h3 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-2">${doa.nama}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${doa.grup}</p>
                <p class="text-gray-700 dark:text-gray-300 line-clamp-2">${doa.idn}</p>
            </div>
        `;
    });
}

let currentUtterance = null;

function showDoaDetail(id) {
    const doa = allDoas.find(d => d.id === id);
    const detailPanel = document.getElementById('detailPanel');
    const doaDetail = document.getElementById('doaDetail');
    
    doaDetail.innerHTML = `
        <h2 class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">${doa.nama}</h2>
        <p class="text-primary-500 dark:text-primary-300 mb-6">${doa.grup}</p>
        
        <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Bahasa Arab:</h3>
            <p class="text-right text-2xl break-words" dir="rtl">${doa.ar}</p>
            <button id="playButtonAr" onclick="toggleSpeech('${doa.ar}', 'ar')" class="mt-2 bg-primary-500 text-white px-3 py-1 rounded">
                <i class="fas fa-play"></i> Putar (Arab)
            </button>
        </div>
        
        <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Transliterasi:</h3>
            <p class="italic break-words">${doa.tr}</p>
        </div>
        
        <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Terjemahan:</h3>
            <p class="break-words">${doa.idn}</p>
            <button id="playButtonId" onclick="toggleSpeech('${doa.idn}', 'id')" class="mt-2 bg-primary-500 text-white px-3 py-1 rounded">
                <i class="fas fa-play"></i> Putar (Indonesia)
            </button>
        </div>
        
        <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Tentang Doa Ini:</h3>
            <p class="text-sm break-words overflow-wrap-anywhere">${formatLinks(doa.tentang)}</p>
        </div>
        
        <div class="mt-6">
            <span class="bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 text-xs font-medium px-2.5 py-0.5 rounded">${doa.tag}</span>
        </div>

        <div class="mt-6 flex space-x-2">
            <button onclick="copyToClipboard('${doa.ar}')" class="bg-primary-500 text-white px-3 py-1 rounded">
                <i class="fas fa-copy"></i> Salin Teks Arab
            </button>
            <button onclick="shareText('${doa.nama}: ${doa.ar}')" class="bg-primary-500 text-white px-3 py-1 rounded">
                <i class="fas fa-share"></i> Bagikan
            </button>
        </div>
    `;
    
    detailPanel.classList.remove('hidden');
    detailPanel.classList.add('fixed', 'right-0', 'top-0', 'h-full', 'w-full', 'lg:w-1/3', 'z-50', 'overflow-y-auto');
}

function toggleSpeech(text, lang) {
    const playButton = lang === 'ar' ? document.getElementById('playButtonAr') : document.getElementById('playButtonId');
    
    if (currentUtterance) {
        window.speechSynthesis.cancel();
        currentUtterance = null;
        playButton.innerHTML = `<i class="fas fa-play"></i> Putar (${lang === 'ar' ? 'Arab' : 'Indonesia'})`;
        return;
    }

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = lang === 'ar' ? 'ar-SA' : 'id-ID';
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(voice => voice.lang.startsWith(currentUtterance.lang));
    if (voice) {
        currentUtterance.voice = voice;
    }

    currentUtterance.onend = () => {
        currentUtterance = null;
        playButton.innerHTML = `<i class="fas fa-play"></i> Putar (${lang === 'ar' ? 'Arab' : 'Indonesia'})`;
    };

    currentUtterance.onerror = () => {
        currentUtterance = null;
        playButton.innerHTML = `<i class="fas fa-play"></i> Putar (${lang === 'ar' ? 'Arab' : 'Indonesia'})`;
        alert(`Maaf, terjadi kesalahan saat memutar suara ${lang === 'ar' ? 'Arab' : 'Indonesia'}.`);
    };

    window.speechSynthesis.speak(currentUtterance);
    playButton.innerHTML = `<i class="fas fa-pause"></i> Jeda (${lang === 'ar' ? 'Arab' : 'Indonesia'})`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Teks Arab berhasil disalin!');
    }, () => {
        alert('Gagal menyalin teks Arab. Silakan coba lagi.');
    });
}

function shareText(text) {
    if (navigator.share) {
        navigator.share({
            title: 'Bagikan Doa',
            text: text
        }).then(() => {
            console.log('Berhasil membagikan');
        }).catch((error) => {
            console.log('Gagal membagikan', error);
        });
    } else {
        alert('Maaf, fitur berbagi tidak didukung di perangkat Anda.');
    }
}

// Pastikan suara-suara telah dimuat
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

function formatLinks(text) {
    // Fungsi ini akan mengubah URL dalam teks menjadi link yang dapat diklik
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:underline">${url}</a>`;
    });
}

function closeDetail() {
    const detailPanel = document.getElementById('detailPanel');
    detailPanel.classList.add('hidden');
}

function filterByCategory(category) {
    const filteredDoas = category === 'all' ? allDoas : allDoas.filter(doa => doa.grup === category);
    displayDoas(filteredDoas);
    if (window.innerWidth < 1024) {
        toggleSidebar();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    sidebarOverlay.classList.toggle('hidden');
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredDoas = allDoas.filter(doa => 
        doa.nama.toLowerCase().includes(searchTerm) || 
        doa.idn.toLowerCase().includes(searchTerm)
    );
    displayDoas(filteredDoas);
});

document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);

document.getElementById('themeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
});

window.onload = fetchAndDisplayDoas;