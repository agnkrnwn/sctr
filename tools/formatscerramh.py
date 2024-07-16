import json
import re

def format_title(title):
    # Replace hyphens and dots with spaces
    title = re.sub(r'[-.]', ' ', title)
    
    # Insert space before capital letters, but not after 'Kh' or at the start
    title = re.sub(r'(?<!^)(?<!Kh )(?=[A-Z])', ' ', title)
    
    # Remove any double spaces and strip
    title = re.sub(r'\s+', ' ', title).strip()
    
    return title

# Membaca data dari ceramah.json
with open('abcv.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Memformat judul untuk setiap item
for item in data:
    item['judul'] = format_title(item['judul'])

# Menyimpan data yang telah diformat kembali ke ceramah.json
with open('abcv.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Data berhasil diperbarui di abcv.json")