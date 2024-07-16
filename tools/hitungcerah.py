import json

# Membaca file ceramah.json
try:
    with open('ceramah.json', 'r', encoding='utf-8') as f:
        ceramah_data = json.load(f)
    
    # Menghitung jumlah ceramah
    jumlah_ceramah = len(ceramah_data)
    
    print(f"Jumlah ceramah dalam ceramah.json: {jumlah_ceramah}")
    
    # Opsional: Menampilkan beberapa ceramah pertama sebagai contoh
    print("\nContoh beberapa ceramah:")
    for i, ceramah in enumerate(ceramah_data[:5], 1):  # Menampilkan 5 ceramah pertama
        print(f"{i}. {ceramah['judul']}")
    
    if jumlah_ceramah > 5:
        print("...")

except FileNotFoundError:
    print("File ceramah.json tidak ditemukan.")
except json.JSONDecodeError:
    print("Terjadi kesalahan saat membaca file JSON. Pastikan format file benar.")