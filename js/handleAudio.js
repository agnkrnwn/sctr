export function setupAudioControls() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.ayatAudioBtn')) {
            const ayatDiv = e.target.closest('div');
            const audioSrc = ayatDiv.querySelector('audio').src;
            playAudio(audioSrc, e.target.closest('.ayatAudioBtn'));
        }
    });
}

function playAudio(src, button) {
    const audio = new Audio(src);
    button.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play();

    audio.onended = () => {
        button.innerHTML = '<i class="fas fa-play"></i>';
    };

    button.onclick = () => {
        if (audio.paused) {
            audio.play();
            button.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            button.innerHTML = '<i class="fas fa-play"></i>';
        }
    };
}