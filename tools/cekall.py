import os

destination_dir = "alldatasurah"

# Jumlah ayat untuk setiap surah Al-Quran
ayat_per_surah = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 
    111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 
    54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 
    49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 
    44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 
    26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 
    6, 3, 5, 4, 5, 6
]

missing_bismillah = []
incomplete_surahs = []

# Memeriksa file bismillah dan jumlah ayat
for surah in range(1, 115):
    bismillah_file = f"{surah:03d}000.mp3"
    bismillah_path = os.path.join(destination_dir, bismillah_file)
    
    if not os.path.exists(bismillah_path):
        missing_bismillah.append(surah)
    
    expected_ayat = ayat_per_surah[surah - 1]
    ayat_count = 0
    
    for ayat in range(1, expected_ayat + 1):
        ayat_file = f"{surah:03d}{ayat:03d}.mp3"
        ayat_path = os.path.join(destination_dir, ayat_file)
        if os.path.exists(ayat_path):
            ayat_count += 1
    
    if ayat_count != expected_ayat:
        incomplete_surahs.append((surah, expected_ayat, ayat_count))

# Menampilkan hasil
if missing_bismillah:
    print("Surah-surah berikut tidak memiliki file bismillah:")
    for surah in missing_bismillah:
        print(f"Surah {surah}")
else:
    print("Semua surah memiliki file bismillah.")

if incomplete_surahs:
    print("\nSurah-surah berikut memiliki jumlah ayat yang tidak sesuai:")
    for surah, expected, actual in incomplete_surahs:
        print(f"Surah {surah}: Seharusnya {expected} ayat, ditemukan {actual} ayat")
else:
    print("\nSemua surah memiliki jumlah ayat yang sesuai.")

print(f"\nTotal surah yang diperiksa: 114")
print(f"Surah dengan bismillah lengkap: {114 - len(missing_bismillah)}")
print(f"Surah dengan jumlah ayat sesuai: {114 - len(incomplete_surahs)}")