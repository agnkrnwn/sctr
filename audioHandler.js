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
                data.data.forEach(surah => {
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
        const surah = surahSelect.value.padStart(3, "0");
        const ayah = ayahInput.value.padStart(3, "0");

        if (!surah || !ayah) {
            alert("Please select a surah and enter an ayah number.");
            return;
        }

        const audioUrl = `https://sctr.netlify.app/audio/${qari}/${surah}${ayah}.mp3`;

        // Create a temporary anchor element to trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = audioUrl;
        downloadLink.download = `surah_${surah}_ayah_${ayah}_qari_${qari}.mp3`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});