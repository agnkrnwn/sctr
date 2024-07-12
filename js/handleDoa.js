export function loadDoaList(searchTerm = '') {
    fetch('doa/doa.json')
        .then(response => response.json())
        .then(data => {
            const listContent = document.getElementById('listContent');
            listContent.innerHTML = '<h3 class="text-xl font-semibold mb-4">Daftar Doa</h3>';
            const doaList = document.createElement('ul');
            doaList.className = 'space-y-2';
            data.forEach(doa => {
                if (doa.nama.toLowerCase().includes(searchTerm)) {
                    const listItem = document.createElement('li');
                    listItem.className = 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors';
                    listItem.innerHTML = doa.nama;
                    listItem.onclick = () => loadDoa(doa);
                    doaList.appendChild(listItem);
                }
            });
            listContent.appendChild(doaList);
        });
}

export function loadDoa(doa) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h2 class="text-3xl font-bold mb-4">${doa.nama}</h2>
        <p class="mb-2"><strong>Grup:</strong> ${doa.grup}</p>
        <p class="text-2xl mb-2 text-right">${doa.ar}</p>
        <p class="mb-2">${doa.tr}</p>
        <p class="mb-4">${doa.idn}</p>
        <p><strong>Tentang:</strong> ${doa.tentang}</p>
    `;
}