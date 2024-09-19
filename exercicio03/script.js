document.getElementById("imageForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const width = document.getElementById("width").value;
    const height = document.getElementById("height").value;
    const quantity = document.getElementById("quantity").value;
    
    const grid = document.getElementById("imageGrid");
    grid.innerHTML = ''; // Limpa o grid antes de adicionar novas imagens
    
    for (let i = 0; i < quantity; i++) {
        // Gerar um seed aleatório
        const seed = Math.random().toString(36).substring(7);
        
        // Usando o seed gerado para criar a URL da imagem
        const imgSrc = `https://picsum.photos/seed/${seed}/${width}/${height}.webp`;
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");
        
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `Imagem aleatória ${i + 1} com ${width}x${height} pixels`;
        
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Baixar Full HD";
        downloadButton.addEventListener("click", function() {
            // Usar o mesmo seed para garantir que a imagem baixada seja a mesma
            const fullHdSrc = `https://picsum.photos/seed/${seed}/1920/1080.webp`;
            const link = document.createElement("a");
            link.href = fullHdSrc;
            link.download = `imagem-${i + 1}.webp`;
            link.click();
        });
        
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copiar Link";
        copyButton.addEventListener("click", function() {
            navigator.clipboard.writeText(imgSrc).then(function() {
                alert("Link copiado para a área de transferência!");
            }, function() {
                alert("Falha ao copiar o link.");
            });
        });

        imageContainer.appendChild(img);
        imageContainer.appendChild(downloadButton);
        imageContainer.appendChild(copyButton);
        grid.appendChild(imageContainer);
    }
});
