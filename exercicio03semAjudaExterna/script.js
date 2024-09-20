const baseUrl = 'https://picsum.photos';

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  
  if(!validateForm()) return;

  const formData = new FormData(event.target);
  const width = formData.get('width');
  const height = formData.get('height');
  const quantidade = formData.get('quantidade');

  const url = `${baseUrl}/${width}/${height}.webp`;

  try {
    const result = document.querySelector('section#result');
    result.innerHTML = 'Carregando...';
    const images = [];
    for(let i = 0; i < quantidade; i++) {
      const response = await fetch(url)
      const data = await response.url
      const imageId = data.split('/')[4];

      let image = {
        id: imageId,
        src: data,
        alt: `Imagem ${imageId}`
      }
      images.push(image);
    }
    renderImages(images, result);
  } catch (error) {
    showMsg('Falha ao carregar as imagens', true);
    alert(error);
  }


}

function validateForm() {
  const inputs = ['width', 'height']
  const errors = []

  inputs.forEach(input => {    
    const element = document.querySelector(`input[name=${input}]`)
    const value = element.value

    if(!value) {
      errors.push(`O campo ${input} é obrigatório`);
    }
  });

  if(errors.length) {
    //alert(errors.join('\n'));
    showMsg(errors.join('<br>'), true);
    return false;
  } else{
    showMsg('');
  }

  return true;

}

function renderImages(images, container) {
    container.innerHTML = '';
    images.forEach(({src, alt, id}) => {
        const card = createImageCard(src, alt, id);
        container.appendChild(card);
    });
}


function createImageCard(src, alt, id) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;

    const actions = document.createElement('div'); 
    actions.classList.add('actions');

    const copyLink = createActionLink('Copiar link', src);
    copyLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(src);
        copyLink.textContent = 'Link copiado';
    });

    const baseUrlHd = 'https://picsum.photos/id/';
    const downloadLink = createActionLink(
        'Baixar HD', 
        `${baseUrlHd}${id}/1920/1080.webp`
    );

    actions.appendChild(downloadLink);

    actions.appendChild(copyLink);
    card.appendChild(img);
    card.appendChild(actions);

    return card;
}

function createActionLink(text, href) {
    const link = document.createElement('a');  
    link.href=  href;
    link.textContent = text;
    link.target = '_blank';
    return link;
}

function showMsg(mensagem, isError = false) {
    const msg = document.querySelector('div#mensagem');
    msg.innerHTML = mensagem;
    msg.className = isError ? 'error' : '';
}
