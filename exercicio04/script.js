// Variáveis para armazenar dados
let photos = [];
let editIndex = null;
let capturedImage = null;
let isPhotoTaken = false; // Nova variável para controlar se a foto foi tirada

// Acessando a câmera do dispositivo e tirando a foto
document.getElementById('takePhotoButton').addEventListener('click', () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                // Exibir a prévia do vídeo ao usuário
                const photoPreview = document.getElementById('photoPreview');
                photoPreview.innerHTML = '';  // Limpa prévias anteriores
                photoPreview.appendChild(video);

                // Capturar a foto após 3 segundos
                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Salvar a imagem capturada
                    capturedImage = canvas.toDataURL('image/png');
                    
                    // Exibir a imagem capturada
                    const img = document.createElement('img');
                    img.src = capturedImage;
                    photoPreview.innerHTML = '';  // Limpa prévias anteriores
                    photoPreview.appendChild(img);

                    // Marcar que a foto foi tirada
                    isPhotoTaken = true;

                    // Parar o vídeo e liberar a câmera
                    stream.getTracks().forEach(track => track.stop());
                }, 3000);
            })
            .catch(() => alert('Não foi possível acessar a câmera. Use o upload de uma foto.'));
    } else {
        alert('Câmera não suportada. Use o upload de uma foto.');
    }
});

// Marcar a localização com geolocalização
document.getElementById('getLocationButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            displayLocation(latitude, longitude);
        }, () => {
            const lat = prompt('Digite a latitude:');
            const lng = prompt('Digite a longitude:');
            displayLocation(lat, lng);
        });
    } else {
        alert('Geolocalização não suportada. Digite manualmente.');
    }
});

// Exibir localização no mapa
function displayLocation(lat, lng) {
    const locationPreview = document.getElementById('locationPreview');
    locationPreview.innerHTML = `Lat: ${lat}, Lng: ${lng}`;
}

// Salvar foto e localização no localStorage
document.getElementById('photoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('photoTitle').value;
    const description = document.getElementById('photoDescription').value;
    const location = document.getElementById('locationPreview').innerText;
    const date = new Date().toLocaleString();

    // Verifica se o título foi inserido
    if (!title) {
        alert('O título é obrigatório.');
        return;
    }

    // Verifica se a foto foi tirada antes de enviar o formulário
    if (!isPhotoTaken) {
        alert('Por favor, tire uma foto antes de salvar.');
        return;
    }

    const photoData = {
        id: Date.now(),
        title,
        description,
        location,
        date,
        image: capturedImage || 'Sem imagem'
    };

    if (editIndex !== null) {
        photos[editIndex] = photoData;
        editIndex = null;
    } else {
        photos.push(photoData);
    }

    localStorage.setItem('photos', JSON.stringify(photos));
    renderTable();
    document.getElementById('photoForm').reset();
    document.getElementById('photoPreview').innerHTML = '';  // Limpa a visualização da foto após salvar
    capturedImage = null;
    isPhotoTaken = false; // Resetar a variável após salvar
});

// Renderizar tabela com as fotos salvas
function renderTable() {
    const photoTableBody = document.querySelector('#photoTable tbody');
    photoTableBody.innerHTML = '';

    photos = JSON.parse(localStorage.getItem('photos')) || [];

    photos.forEach((photo, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${photo.title}</td>
            <td>${photo.description || 'Sem descrição'}</td>
            <td>${photo.location}</td>
            <td>${photo.date}</td>
            <td>
                <button onclick="editPhoto(${index})">Editar</button>
                <button onclick="deletePhoto(${index})">Excluir</button>
                <button onclick="viewDetails(${index})">Visualizar</button>
            </td>
        `;

        photoTableBody.appendChild(row);
    });
}

// Editar uma foto
function editPhoto(index) {
    const photo = photos[index];
    document.getElementById('editTitle').value = photo.title;
    document.getElementById('editDescription').value = photo.description;
    document.getElementById('editForm').style.display = 'block';
    editIndex = index;
}

// Excluir uma foto
function deletePhoto(index) {
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
        photos.splice(index, 1);
        localStorage.setItem('photos', JSON.stringify(photos));
        renderTable();
    }
}

// Visualizar detalhes da foto
function viewDetails(index) {
    const photo = photos[index];

    document.getElementById('modalTitle').innerHTML = `<strong>Título:</strong> ${photo.title}`;
    document.getElementById('modalDescription').innerHTML = `<strong>Descrição:</strong> ${photo.description || 'Sem descrição'}`;
    
    if (photo.image !== 'Sem imagem') {
        document.getElementById('modalPhoto').innerHTML = `
            <img src="${photo.image}" alt="Foto" style="max-width: 100%; height: auto; cursor: pointer;" onclick="window.open('${photo.image}', '_blank')">
            <p style="font-size: 0.9em;">(Clique na imagem para ver em tamanho real)</p>
        `;
    } else {
        document.getElementById('modalPhoto').innerHTML = 'Sem imagem disponível';
    }
    
    const latLng = photo.location.replace('Lat: ', '').replace('Lng: ', '').split(', ');
    const googleMapsLink = `https://www.google.com/maps?q=${latLng[0]},${latLng[1]}`;
    document.getElementById('modalLocation').innerHTML = `
        <strong>Localização:</strong> <a href="${googleMapsLink}" target="_blank">Ver no Google Maps</a> (${photo.location})
    `;

    const photoModal = document.getElementById('photoModal');
    photoModal.style.display = 'block';

    // Fechar modal ao clicar fora dele ou no botão de fechar
    window.addEventListener('click', function(event) {
        if (event.target === photoModal || event.target.id === 'closeModalButton') {
            photoModal.style.display = 'none';
        }
    });
}
