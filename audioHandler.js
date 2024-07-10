document.addEventListener("DOMContentLoaded", () => {
    const audioSettingsToggle = document.getElementById("audioSettingsToggle");
    const audioSettingsModal = document.getElementById("audioSettingsModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const qariSelect = document.getElementById("qariSelect");
    const surahSelect = document.getElementById("surahSelect");
    const ayahInput = document.getElementById("ayahInput");
    const downloadAudioBtn = document.getElementById("downloadAudioBtn");
    const audioPreview = document.getElementById("audioPreview");

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
    fetch("https://sctr.netlify.app/surat")
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

    // Toggle modal
    audioSettingsToggle.addEventListener("click", () => {
        audioSettingsModal.classList.toggle("hidden");
        audioSettingsModal.classList.toggle("flex");
    });

    closeModalBtn.addEventListener("click", () => {
        audioSettingsModal.classList.add("hidden");
        audioSettingsModal.classList.remove("flex");
        audioPreview.pause();
        audioPreview.src = "";
    });

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
            fetch(`https://sctr.netlify.app/surat/${surahNumber}`)
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
            const surahNumber = surahSelect.value;
            const ayah = ayahInput.value.trim();
            let fileName;

            if (ayah === "") {
                fileName = `surah_${surahNumber}_full_qari_${qari}.mp3`;
            } else {
                fileName = `surah_${surahNumber}_ayah_${ayah}_qari_${qari}.mp3`;
            }

            triggerDownload(audioUrl, fileName);
        } else {
            alert("Please select valid audio before downloading.");
        }
    });

    function triggerDownload(audioUrl, fileName) {
        const downloadLink = document.createElement("a");
        downloadLink.href = audioUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
});