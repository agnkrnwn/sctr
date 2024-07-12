document.addEventListener("DOMContentLoaded", () => {
    const qariSelect = document.getElementById("qariSelect");
    const surahSelect = document.getElementById("surahSelect");
    const ayahInput = document.getElementById("ayahInput");
    const downloadAudioBtn = document.getElementById("downloadAudioBtn");
    const audioPreview = document.getElementById("audioPreview");
    const darkModeToggle = document.getElementById("darkModeToggle");

    const qariOptions = {
        "01": "Abdullah Al-Juhany",
        "02": "Abdul Muhsin Al-Qasim",
        "03": "Abdurrahman As-Sudais",
        "04": "Ibrahim Al-Dossari",
        "05": "Mishari Rashid Al-Afasy",
    };

    let surahData = [];

    // Populate qari options
    for (let [value, name] of Object.entries(qariOptions)) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = name;
        qariSelect.appendChild(option);
    }

    // Fetch and populate surah options
    fetch("./surat/surat.json")
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                surahData = data.data;
                surahData.forEach(surah => {
                    const option = document.createElement("option");
                    option.value = surah.nomor;
                    option.textContent = `${surah.nomor}. ${surah.namaLatin}`;
                    surahSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error fetching surah list:", error));

    // Add event listeners for audio preview
    qariSelect.addEventListener("change", updateAudioPreview);
    surahSelect.addEventListener("change", updateAudioPreview);
    ayahInput.addEventListener("input", updateAudioPreview);

    function updateAudioPreview() {
        const qari = qariSelect.value;
        const surahNumber = surahSelect.value;
        const ayah = ayahInput.value.trim();

        if (!surahNumber) {
            audioPreview.src = "";
            return;
        }

        if (ayah === "") {
            // Preview surah lengkap
            const selectedSurah = surahData.find(s => s.nomor == surahNumber);
            if (selectedSurah && selectedSurah.audioFull[qari]) {
                audioPreview.src = selectedSurah.audioFull[qari];
            }
        } else {
            // Preview ayat spesifik
            fetch(`./surat/${surahNumber}.json`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        const ayahData = data.data.ayat.find(a => a.nomorAyat == ayah);
                        if (ayahData && ayahData.audio[qari]) {
                            audioPreview.src = ayahData.audio[qari];
                        } else {
                            audioPreview.src = "";
                        }
                    }
                })
                .catch(error => {
                    console.error("Error fetching ayah data:", error);
                    audioPreview.src = "";
                });
        }
    }

    // Download audio
    downloadAudioBtn.addEventListener("click", () => {
        const audioUrl = audioPreview.src;
        if (audioUrl) {
            const qari = qariSelect.value;
            const qariName = qariOptions[qari].replace(/\s+/g, '-').toLowerCase();
            const surahNumber = surahSelect.value;
            const surahName = surahData.find(s => s.nomor == surahNumber).namaLatin.replace(/\s+/g, '-').toLowerCase();
            const ayah = ayahInput.value.trim();
            
            let fileName = ayah === "" 
                ? `surat-${surahName}-full-${qariName}.mp3`
                : `surat-${surahName}-ayat-${ayah}-${qariName}.mp3`;

            const downloadLink = document.createElement("a");
            downloadLink.href = audioUrl;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            alert("Please select valid audio before downloading.");
        }
    });

    // Dark mode toggle
    darkModeToggle.addEventListener("change", () => {
        document.documentElement.classList.toggle("dark");
    });
});