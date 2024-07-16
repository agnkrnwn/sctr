import requests
from bs4 import BeautifulSoup
import json
import os
from urllib.parse import urljoin
import re

def split_title(title):
    return ' '.join(re.findall(r'[A-Z](?:[a-z]+|[A-Z]*(?=[A-Z][a-z]|\d|\W|$)|\d*)', title))

# URL folder
base_url = "https://archive.org/download/Kajian_al-Quran_sunnah/"

# Mengambil konten halaman
response = requests.get(base_url)
soup = BeautifulSoup(response.text, 'html.parser')

# Mencari tabel dengan kelas "directory-listing-table"
table = soup.find('table', class_='directory-listing-table')

# Menyimpan informasi file mp3
mp3_files = []

if table:
    # Mencari semua baris dalam tabel
    rows = table.find_all('tr')
    for row in rows:
        # Mencari kolom pertama (nama file)
        name_col = row.find('td')
        if name_col:
            link = name_col.find('a')
            if link and link['href'].endswith('.mp3'):
                href = link['href']
                full_url = urljoin(base_url, href)
                title = os.path.splitext(href)[0]  # Menghapus ekstensi .mp3
                formatted_title = split_title(title)
                mp3_files.append({
                    "judul": formatted_title,
                    "link": full_url
                })

# Menyimpan ke file JSON
with open('ceramah.json', 'w', encoding='utf-8') as f:
    json.dump(mp3_files, f, ensure_ascii=False, indent=4)

print(f"Data berhasil disimpan ke ceramah.json")