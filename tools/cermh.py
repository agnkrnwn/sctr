import requests
from bs4 import BeautifulSoup
import json
import os
from urllib.parse import urljoin, unquote
import re

def format_title(title):
    # Decode URL-encoded characters
    title = unquote(title)
    
    # Remove file extension
    title = os.path.splitext(title)[0]
    
    # Handle different title formats
    if 'Kajian #DirumahAja' in title:
        # For titles like "Kitab Tauhid (Kajian #DirumahAja) - 20220322 071"
        return title + '.mp3'
    elif title.startswith('KitabTauhid-'):
        # Remove 'KitabTauhid-' prefix
        title = title[11:]
        
        # Insert space before capital letters
        title = re.sub(r'(\d+)([A-Z])', r'\1 \2', title)
        title = re.sub(r'([a-z])([A-Z])', r'\1 \2', title)
        
        # Replace hyphens with spaces
        title = title.replace('-', ' ')
        
        # Capitalize first letter of each word, except for 'dan'
        title = ' '.join(word.capitalize() if word.lower() != 'dan' else word for word in title.split())
        
        return 'Kitab Tauhid ' + title + '.mp3'
    else:
        # For other formats, just replace hyphens with spaces
        return title.replace('-', ' ') + '.mp3'

# URL folder yang baru
base_url = "https://archive.org/download/UstadzAhmadZainuddin-SyarahKitabTauhid/"

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
                formatted_title = format_title(href)
                mp3_files.append({
                    "judul": formatted_title,
                    "link": full_url
                })

# Membaca data yang sudah ada di ceramah.json (jika ada)
try:
    with open('ceramah.json', 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
except FileNotFoundError:
    existing_data = []

# Menggabungkan data baru dengan data yang sudah ada
combined_data = existing_data + mp3_files

# Menyimpan data gabungan ke ceramah.json
with open('ceramah.json', 'w', encoding='utf-8') as f:
    json.dump(combined_data, f, ensure_ascii=False, indent=4)

print(f"Data berhasil disimpan ke ceramah.json")