document.addEventListener('DOMContentLoaded', function() {
    const generateForm = document.getElementById('generateForm');
    const generateButton = document.getElementById('generateButton');
    const resultDiv = document.getElementById('result');

    generateButton.addEventListener('click', function() {
        const saldo = parseFloat(document.getElementById('saldo').value);
        const bet = parseFloat(document.getElementById('bet').value);

        if (isNaN(saldo) || isNaN(bet)) {
            console.log('Masukkan saldo dan bet yang valid.');
            resultDiv.innerHTML = 'Masukkan saldo dan bet yang valid.';
            return;
        }

        let result = '';
        let spinCount;

        do {
            const isTurbo = Math.random() < 0.5;
            const isCepat = Math.random() < 0.5;
            const isManual = Math.random() < 0.5;

            result = '';

            if (isTurbo && !isCepat) {
                result += '✅';
            } else {
                result += '❎';
            }

            if (isCepat && !isTurbo) {
                result += '✅';
            } else {
                result += '❎';
            }

            if (isManual) {
                result += '✅ | DC ON | ';
                spinCount = [10, 20, 30, 50, 70][Math.floor(Math.random() * 5)];
                result += spinCount + ' SPIN';
            } else {
                result += '❎ | DC OFF | ';
                if (result.includes('❎❎❎')) {
                    spinCount = Math.random() < 0.5 ? 10 : 20;
                } else {
                    spinCount = [10, 20, 30, 50][Math.floor(Math.random() * 4)];
                }
                result += spinCount + ' SPIN';
            }

        } while (result === '✅✅❎' || result === '✅✅✅' || result === '❎❎❎'); // Ulangi jika hasil sesuai dengan pola yang tidak diinginkan

        console.log('Hasil:', result);
        resultDiv.innerHTML = result;
    });
});





function incrementBet() {
    const betInput = document.getElementById('bet');
    const currentBet = parseFloat(betInput.value) || 0;
    const newBet = currentBet + 50; // Sesuaikan nilai yang ingin Anda tambahkan
    betInput.value = newBet;
}

function decrementBet() {
    const betInput = document.getElementById('bet');
    const currentBet = parseFloat(betInput.value) || 0;
    const newBet = currentBet - 50; // Sesuaikan nilai yang ingin Anda kurangkan
    if (newBet >= 0) {
        betInput.value = newBet;
    }
}
