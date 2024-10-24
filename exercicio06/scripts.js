// Array de produtos simulando o arquivo JSON ou a API
const products = [
  {
    id: 1,
    name: "Notebook Dell Inspiron 15 3000",
    description: "Notebook Dell Inspiron 15 3000 com 8GB RAM, 1TB HD.",
    price: 2999.99,
    category: "Notebook",
    brand: "Dell",
    images: ["notebook-dell.jpg"],
  },
  {
    id: 2,
    name: "Monitor LG 24' LED Full HD",
    description: "Monitor LG 24' LED Full HD, 60Hz.",
    price: 899.99,
    category: "Monitor",
    brand: "LG",
    images: ["monitor-lg.jpg"],
  },
  {
    id: 3,
    name: "Teclado Mecânico Gamer HyperX Alloy FPS",
    description: "Teclado Mecânico Gamer HyperX Alloy FPS com iluminação RGB.",
    price: 299.99,
    category: "Teclado",
    brand: "HyperX",
    images: ["teclado-hyperx.jpg"],
  },
];

// Inicialização do carrinho
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Função para exibir os produtos
function displayProducts(productsList) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Limpa o conteúdo anterior

  productsList.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>R$ ${product.price.toFixed(2)}</p>
            <button onclick="viewProduct(${product.id})">Ver Detalhes</button>
        `;

    productList.appendChild(productCard);
  });
}

// Exibe os detalhes de um produto
function viewProduct(productId) {
  const product = products.find((p) => p.id === productId);

  if (product) {
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-image").src = product.images[0];
    document.getElementById("product-description").textContent =
      product.description;
    document.getElementById(
      "product-price"
    ).textContent = `R$ ${product.price.toFixed(2)}`;
    document.getElementById("product-details").style.display = "block";
    document.getElementById("home").style.display = "none"; // Esconde a lista de produtos

    // Configurar o botão "Adicionar ao Carrinho"
    const addToCartBtn = document.getElementById("add-to-cart");
    addToCartBtn.onclick = function () {
      addToCart(product.id);
    };
  }
}

// Função para voltar à página inicial
function goBackToHome() {
  document.getElementById("product-details").style.display = "none";
  document.getElementById("cart").style.display = "none";
  document.getElementById("home").style.display = "block";
}

// Função para adicionar um produto ao carrinho
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  if (product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produto adicionado ao carrinho!");
    goBackToHome(); // Volta para a página inicial após adicionar ao carrinho
  }
}

// Exibe os produtos no carrinho
function displayCart() {
  const cartSection = document.getElementById("cart");
  cartSection.style.display = "block";
  document.getElementById("home").style.display = "none";
  document.getElementById("product-details").style.display = "none";

  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItems.innerHTML = ""; // Limpa o conteúdo anterior

  let total = 0;
  cart.forEach((product) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>R$ ${product.price.toFixed(2)}</p>
            <button onclick="removeFromCart(${product.id})">Remover</button>
        `;
    cartItems.appendChild(cartItem);
    total += product.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

// Função para remover um produto do carrinho
function removeFromCart(productId) {
  cart = cart.filter((product) => product.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Função para finalizar a compra
function checkout() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  // Limpa o carrinho após finalizar a compra
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Compra finalizada com sucesso!");
  displayCart(); // Atualiza a exibição do carrinho
}

// Função de inicialização
function init() {
  // Exibir produtos ao carregar a página
  displayProducts(products);

  // Exibir itens do carrinho ao carregar a página de carrinho
  if (document.getElementById("cart-items")) {
    displayCart();
  }

  // Configurar botão de checkout
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }
}

document.addEventListener("DOMContentLoaded", init);
