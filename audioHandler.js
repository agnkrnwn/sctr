document.addEventListener("DOMContentLoaded", () => {
    const audioSettingsToggle = document.getElementById("audioSettingsToggle");
    const audioSettingsModal = document.getElementById("audioSettingsModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const qariSelect = document.getElementById("qariSelect");
    const surahSelect = document.getElementById("surahSelect");
    const ayahInput = document.getElementById("ayahInput");
    const downloadAudioBtn = document.getElementById("downloadAudioBtn");

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
    });

    // Download audio
    downloadAudioBtn.addEventListener("click", () => {
        const qari = qariSelect.value;
        const surahNumber = surahSelect.value;
        const ayah = ayahInput.value.trim();

        const selectedSurah = surahData.find(s => s.nomor == surahNumber);
        if (!selectedSurah) {
            alert("Please select a valid surah.");
            return;
        }

        if (ayah === "") {
            // Download full surah
            const audioUrl = selectedSurah.audioFull[qari];
            const fileName = `surah_${surahNumber}_full_qari_${qari}.mp3`;
            triggerDownload(audioUrl, fileName);
        } else {
            // Download specific ayah
            const ayahNumber = parseInt(ayah);
            if (isNaN(ayahNumber) || ayahNumber < 1 || ayahNumber > selectedSurah.jumlahAyat) {
                alert(`Please enter a valid ayah number between 1 and ${selectedSurah.jumlahAyat}.`);
                return;
            }
            
            // Fetch the specific ayah data
            fetch(`https://sctr.netlify.app/surat/${surahNumber}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        const ayahData = data.data.ayat.find(a => a.nomorAyat == ayahNumber);
                        if (ayahData && ayahData.audio[qari]) {
                            const audioUrl = ayahData.audio[qari];
                            const fileName = `surah_${surahNumber}_ayah_${ayahNumber}_qari_${qari}.mp3`;
                            triggerDownload(audioUrl, fileName);
                        } else {
                            alert("Audio for this ayah is not available.");
                        }
                    } else {
                        alert("Failed to fetch ayah data.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching ayah data:", error);
                    alert("An error occurred while fetching ayah data.");
                });
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