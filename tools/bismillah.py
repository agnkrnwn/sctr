import os
import shutil

source_dir = "dataquran"
destination_dir = "alldatasurah"

# Membuat folder tujuan jika belum ada
if not os.path.exists(destination_dir):
    os.makedirs(destination_dir)

missing_bismillah = []

# Iterasi melalui semua folder surah
for surah in range(1, 115):
    surah_folder = f"{source_dir}/{surah:03d}"
    
    if not os.path.exists(surah_folder):
        print(f"Folder untuk surah {surah:03d} tidak ditemukan.")
        continue
    
    # Memeriksa file bismillah
    bismillah_file = f"{surah:03d}000Terjemahan.mp3"
    bismillah_path = os.path.join(surah_folder, "001", bismillah_file)
    if not os.path.exists(bismillah_path):
        missing_bismillah.append(f"{surah:03d}")
    
    # Memindahkan dan mengubah nama file
    for root, dirs, files in os.walk(surah_folder):
        for file in files:
            if file.endswith("Terjemahan.mp3"):
                old_path = os.path.join(root, file)
                new_name = file[:6] + ".mp3"
                new_path = os.path.join(destination_dir, new_name)
                shutil.copy2(old_path, new_path)

print("Proses selesai.")

if missing_bismillah:
    print("Folder-folder berikut tidak memiliki file bismillah (XXX000.mp3):")
    for surah in missing_bismillah:
        print(f"Folder {surah}")
else:
    print("Semua folder memiliki file bismillah.")