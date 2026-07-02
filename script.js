const API_URL = '/api/tugas';

document.addEventListener('DOMContentLoaded', ambilTugas);

async function ambilTugas() {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    const tbody = document.getElementById('tugas-list');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">Belum ada tugas. Santai dulu! 😎</td></tr>`;
        return;
    }

    data.forEach(tugas => {
        const tr = document.createElement('tr');
        const isSelesai = tugas.status === 'Selesai';
        
        if (isSelesai) tr.classList.add('completed');

        tr.innerHTML = `
            <td>${tugas.nama_tugas}</td>
            <td>${tugas.mata_kuliah}</td>
            <td>${tugas.deadline}</td>
            <td>
                <span class="badge ${isSelesai ? 'badge-success' : 'badge-pending'}">
                    ${tugas.status}
                </span>
            </td>
            <td>
                ${!isSelesai ? `<button class="btn-action btn-done" onclick="selesaiTugas(${tugas.id})">Done</button>` : ''}
                <button class="btn-action btn-delete" onclick="hapusTugas(${tugas.id})">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('todo-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama_tugas = document.getElementById('nama_tugas').value;
    const mata_kuliah = document.getElementById('mata_kuliah').value;
    const deadline = document.getElementById('deadline').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_tugas, mata_kuliah, deadline })
    });

    document.getElementById('todo-form').reset();
    ambilTugas();
});

async function selesaiTugas(id) {
    await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    ambilTugas();
}

async function hapusTugas(id) {
    if (confirm('Yakin mau hapus tugas ini, bos?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        ambilTugas();
    }
}