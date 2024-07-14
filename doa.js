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
    
    const escapedNama = doa.nama.replace(/[']/g, "\\'");
    const escapedAr = doa.ar.replace(/[']/g, "\\'");
    const escapedTr = doa.tr.replace(/[']/g, "\\'");
    const escapedIdn = doa.idn.replace(/[']/g, "\\'");
    
    doaDetail.innerHTML = `
        <h2 class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">${doa.nama}</h2>
        <p class="text-primary-500 dark:text-primary-300 mb-6">${doa.grup}</p>
        
        <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Bahasa Arab:</h3>
            <p class=" text-right text-2xl break-words" dir="rtl">${doa.ar}</p>
            <button id="playButtonAr" onclick="toggleSpeech('${escapedAr}', 'ar')" class="mt-2 bg-primary-500 text-white px-3 py-1 rounded">
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
            <button id="playButtonId" onclick="toggleSpeech('${escapedIdn}', 'id')" class="mt-2 bg-primary-500 text-white px-3 py-1 rounded">
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
            <button onclick="copyAllDetails('${escapedNama}', '${escapedAr}', '${escapedTr}', '${escapedIdn}')" class="bg-primary-500 text-white px-3 py-1 rounded">
                <i class="fas fa-copy mr-2"></i> Salin
            </button>
            <button onclick="downloadAsImage('${escapedNama}', '${escapedAr}', '${escapedTr}', '${escapedIdn}')" class="bg-primary-500 text-white px-3 py-1 rounded">
                <i class="fas fa-download mr-2"></i> Download
            </button>
        </div>
    `;
    
    detailPanel.classList.remove('hidden');
    detailPanel.classList.add('fixed', 'right-0', 'top-0', 'h-full', 'w-full', 'lg:w-1/3', 'z-50', 'overflow-y-auto');
}

function downloadAsImage(title, arabic, transliteration, translation) {
    const doaImage = document.createElement('div');
    doaImage.innerHTML = `
        <div id="doaImageContent" style="width: 1080px; height: 1920px; padding: 120px 80px; background: linear-gradient(to bottom, #1a202c, #2d3748); color: white; font-family: 'Nunito', sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; width: 90%; display: flex; flex-direction: column;">
                <h1 style="font-size: 44px; margin-bottom: 40px; color: #48bb78; text-align: center;">${title}</h1>
                <p style=" font-size: 40px; margin-bottom: 40px; direction: rtl; line-height: 1.6; text-align: right;">${arabic}</p>
                <p style="font-size: 28px; margin-bottom: 30px; font-style: italic; color: #a0aec0; text-align: left;">${transliteration}</p>
                <p style="font-size: 28px; line-height: 1.5; color: #e2e8f0; text-align: left;">${translation}</p>
            </div>
            <div style="position: absolute; bottom: 40px; font-size: 24px; color: #a0aec0;">Doa Modern</div>
        </div>
    `;

    document.body.appendChild(doaImage);

    html2canvas(document.getElementById('doaImageContent'), {
        allowTaint: true,
        useCORS: true,
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${title}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        document.body.removeChild(doaImage);
    });
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

function copyAllDetails(title, arabic, transliteration, translation) {
    const textToCopy = `${title}\n\nBahasa Arab:\n${arabic}\n\nTransliterasi:\n${transliteration}\n\nTerjemahan:\n${translation}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Semua detail doa berhasil disalin!');
    }, () => {
        alert('Gagal menyalin detail doa. Silakan coba lagi.');
    });
}

function formatLinks(text) {
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

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

window.onload = fetchAndDisplayDoas;