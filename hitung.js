
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');
const turboCheckbox = document.getElementById('turbo');
const cepatCheckbox = document.getElementById('cepat');
const lewatiCheckbox = document.getElementById('lewati');
const betInput = document.getElementById('bet');
const saldoInput = document.getElementById('saldo');
const scatterInput = document.getElementById('scatter');
const hasilP = document.getElementById('hasil');

// Daftar nilai yang sesuai dengan tingkatan yang diinginkan
const values = [10, 20, 30, 50, 70, 100, 500, 1000];

// Ketika slider digeser, atur nilai sesuai dengan nilai bertingkat
slider.addEventListener('input', function() {
  const index = parseInt(this.value) - 1;
  sliderValue.textContent = values[index];
});

// Fungsi untuk menghitung berdasarkan kondisi checkbox
function hitung() {
  const selectedValue = parseInt(sliderValue.textContent);
  const bet = parseFloat(betInput.value) || 0;
  const saldo = parseFloat(saldoInput.value) || 0;
  const scatter = parseFloat(scatterInput.value) || 0;

  let hasil = 0;

  const timestamp = Date.now(); // ID timestamp saat ini untuk unik
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  if (turboCheckbox.checked) {
    hasil += selectedValue * bet + timestamp * randomNumber;
    console.log(`Turbo dipilih: ${selectedValue} x ${bet} + ${timestamp} x ${randomNumber} = ${hasil}`);
  }
  if (cepatCheckbox.checked) {
    hasil += saldo / selectedValue + timestamp * randomNumber;
    console.log(`Cepat dipilih: ${saldo} / ${selectedValue} + ${timestamp} x ${randomNumber} = ${saldo / selectedValue + timestamp + randomNumber}`);
  }
  if (lewatiCheckbox.checked) {
    hasil += selectedValue + scatter + timestamp * randomNumber;
    console.log(`Lewati dipilih: ${selectedValue} + ${scatter} + ${timestamp} x ${randomNumber}= ${selectedValue + scatter + timestamp + randomNumber}`);
  }

  // Jika tidak ada kotak centang yang dicentang, lakukan perkalian dengan angka acak antara 5 dan 488
  if (!turboCheckbox.checked && !cepatCheckbox.checked && !lewatiCheckbox.checked) {
    const angkaAcak = Math.floor(Math.random() * (488 - 5 + 1)) + 5;
    hasil = selectedValue * angkaAcak + timestamp * randomNumber;
    console.log(`Tanpa centang, hasil perkalian dengan angka acak ${angkaAcak}: ${selectedValue} x ${angkaAcak} + ${timestamp} x ${randomNumber} = ${hasil}`);
  }

  // Menghapus tanda "." (titik) dari hasil sebelum memecahnya menjadi digit-digit individu dan menghitung jumlahnya
  const hasilString = hasil.toString().replace('.', '');
  const digitArray = hasilString.split('').map(Number);
  const jumlahDigit = digitArray.reduce((total, digit) => total + digit, 0);
  const manspin = Math.floor(Math.random() * 10) + 1;

  let spinValue;

    if (jumlahDigit >= 10 && jumlahDigit <= 30) {
    spinValue = "70 spin";
    } else if (jumlahDigit >= 31 && jumlahDigit <= 40) {
    spinValue = "50 spin";
    } else if (jumlahDigit >= 41 && jumlahDigit <= 45) {
    spinValue = "30 spin";
    } else if (jumlahDigit >= 46 && jumlahDigit <= 50) {
    spinValue = "manual spin bebas";
    } else if (jumlahDigit >= 51 && jumlahDigit <= 60) {
    spinValue = "20 spin";
    } else if (jumlahDigit >= 61 && jumlahDigit <= 65) {
    spinValue = "manual spin " + manspin + " kali";
    } else if (jumlahDigit >= 67 && jumlahDigit <= 70) {
    spinValue = "10 spin";
    } else {
    spinValue = "freestyle";
    }

  // Menampilkan hasil akhir pada elemen hasilP
  hasilP.innerHTML = `${spinValue}`;
  console.log(`Hasil: ${hasilString} = ${digitArray.join(' + ')} = ${jumlahDigit}`);
}

// Event listener untuk tombol "Hitung"
const hitungButton = document.getElementById('hitungButton');
hitungButton.addEventListener('click', hitung);