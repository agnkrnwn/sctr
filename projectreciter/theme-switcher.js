// Definisikan tema warna
const themes = {
    default: {
        50: '240, 249, 255',
        100: '224, 242, 254',
        200: '186, 230, 253',
        300: '125, 211, 252',
        400: '56, 189, 248',
        500: '14, 165, 233',
        600: '2, 132, 199',
        700: '3, 105, 161',
        800: '7, 89, 133',
        900: '12, 74, 110',
        950: '28, 122, 11'
    },
    green: {
        50: '240, 253, 244',
        100: '220, 252, 231',
        200: '187, 247, 208',
        300: '134, 239, 172',
        400: '74, 222, 128',
        500: '34, 197, 94',
        600: '22, 163, 74',
        700: '21, 128, 61',
        800: '22, 101, 52',
        900: '20, 83, 45',
        950: '5, 46, 22'
    },
    blue: {
        50: '239, 246, 255',
        100: '219, 234, 254',
        200: '191, 219, 254',
        300: '147, 197, 253',
        400: '96, 165, 250',
        500: '59, 130, 246',
        600: '37, 99, 235',
        700: '29, 78, 216',
        800: '30, 64, 175',
        900: '30, 58, 138',
        950: '23, 37, 84'
    },
    purple: {
        50: '250, 245, 255',
        100: '243, 232, 255',
        200: '233, 213, 255',
        300: '216, 180, 254',
        400: '192, 132, 252',
        500: '168, 85, 247',
        600: '147, 51, 234',
        700: '126, 34, 206',
        800: '107, 33, 168',
        900: '88, 28, 135',
        950: '59, 7, 100'
    },
    orange: {
        50: '255, 247, 237',
        100: '255, 237, 213',
        200: '254, 215, 170',
        300: '253, 186, 116',
        400: '251, 146, 60',
        500: '249, 115, 22',
        600: '234, 88, 12',
        700: '194, 65, 12',
        800: '154, 52, 18',
        900: '124, 45, 18',
        950: '67, 20, 7'
    },
    teal: {
        50: '240, 253, 250',
        100: '204, 251, 241',
        200: '153, 246, 228',
        300: '94, 234, 212',
        400: '45, 212, 191',
        500: '20, 184, 166',
        600: '13, 148, 136',
        700: '15, 118, 110',
        800: '17, 94, 89',
        900: '19, 78, 74',
        950: '4, 47, 46'
    },
    pink: {
        50: '253, 242, 248',
        100: '252, 231, 243',
        200: '251, 207, 232',
        300: '249, 168, 212',
        400: '244, 114, 182',
        500: '236, 72, 153',
        600: '219, 39, 119',
        700: '190, 24, 93',
        800: '157, 23, 77',
        900: '131, 24, 67',
        950: '80, 7, 36'
    },
    indigo: {
        50: '238, 242, 255',
        100: '224, 231, 255',
        200: '199, 210, 254',
        300: '165, 180, 252',
        400: '129, 140, 248',
        500: '99, 102, 241',
        600: '79, 70, 229',
        700: '67, 56, 202',
        800: '55, 48, 163',
        900: '49, 46, 129',
        950: '30, 27, 69'
    },
    red: {
        50: '254, 242, 242',
        100: '254, 226, 226',
        200: '254, 202, 202',
        300: '252, 165, 165',
        400: '248, 113, 113',
        500: '239, 68, 68',
        600: '220, 38, 38',
        700: '185, 28, 28',
        800: '153, 27, 27',
        900: '127, 29, 29',
        950: '69, 10, 10'
    },
    yellow: {
        50: '255, 251, 235',
        100: '254, 243, 199',
        200: '253, 230, 138',
        300: '252, 211, 77',
        400: '251, 191, 36',
        500: '245, 158, 11',
        600: '217, 119, 6',
        700: '180, 83, 9',
        800: '146, 64, 14',
        900: '120, 53, 15',
        950: '69, 29, 3'
    },
    cyan: {
        50: '236, 254, 255',
        100: '207, 250, 254',
        200: '165, 243, 252',
        300: '103, 232, 249',
        400: '34, 211, 238',
        500: '6, 182, 212',
        600: '8, 145, 178',
        700: '14, 116, 144',
        800: '21, 94, 117',
        900: '22, 78, 99',
        950: '8, 48, 60'
    },
    lime: {
        50: '247, 254, 231',
        100: '236, 252, 203',
        200: '217, 249, 157',
        300: '190, 242, 100',
        400: '163, 230, 53',
        500: '132, 204, 22',
        600: '101, 163, 13',
        700: '77, 124, 15',
        800: '63, 98, 18',
        900: '54, 83, 20',
        950: '26, 46, 5'
    }
};

// ... (fungsi setTheme dan loadTheme tetap sama)

// Update dropdown di HTML

function setTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;

    Object.keys(theme).forEach(shade => {
        document.documentElement.style.setProperty(`--color-primary-${shade}`, theme[shade]);
    });

    // Opsional: Simpan preferensi tema di localStorage
    localStorage.setItem('theme', themeName);
}

// Fungsi untuk memuat tema dari localStorage saat halaman dimuat
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
        setTheme(savedTheme);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        setTheme('default');
    } else {
        loadTheme();
    }
});
// Panggil loadTheme saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadTheme);

