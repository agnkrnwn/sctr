import json

# Baca file JSON
with open('qurandata.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Fungsi untuk menambahkan URL audio dan gambar
def add_urls(chapter, aya_count):
    urls = []
    for aya in range(1, aya_count + 1):
        image_url = f"https://everyayah.com/data/images_png/{chapter}_{aya}.png"
        urls.append({
            "aya": aya,
            "image_url": image_url,
            "audio_urls": {}
        })
    return urls

# Tambahkan URL ke setiap bab
for chapter in data['chapters']:
    chapter['urls'] = add_urls(int(chapter['value']), chapter['ayaCount'])

# Tambahkan audio URL untuk setiap qari
for reciter in data['reciters']:
    reciter_value = reciter['value']
    for chapter in data['chapters']:
        chapter_str = chapter['value'].zfill(3)
        for url in chapter['urls']:
            aya_str = str(url['aya']).zfill(3)
            audio_url = f"https://everyayah.com/data/{reciter_value}/{chapter_str}{aya_str}.mp3"
            url['audio_urls'][reciter_value] = audio_url

# Tulis kembali ke file JSON
with open('qurandata_updated.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

print("File JSON telah diperbarui dengan URL audio dan gambar.")