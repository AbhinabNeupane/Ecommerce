//Variable declaration

const products = [
  { id: 1, name: "Intel Core i7 CPU", price: 10, image: "Images/Processor.jpg" },
  { id: 2, name: "NVIDIA RTX 5090 GPU", price: 15, image: "Images/GraphicsCard.jpg" },
  { id: 3, name: "Corsair 16GB RAM", price: 25, image: "Images/ram.jpg" },
  { id: 4, name: "Samsung 1TB SSD", price: 5, image: "Images/ssd.jpg" },
  { id: 5, name: "AIO CPU Cooler", price: 12, image: "Images/AIO.jpg" },
];

const homePage = document.getElementById("home-page");
const cartPage = document.getElementById("cart-page");
const cartItemsEl = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const cartCountEl = document.getElementById("cart-count");

renderProducts();
updateCartCount();

//Homepage

function renderProducts() {
  homePage.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}"class="w-full h-36 object-contain mb-2" />
      <h3 class="font-bold">${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})" class="mt-2 bg-blue-500 text-white px-2 py-1 rounded">Add to Cart</button>
    `;
    homePage.appendChild(card);
  });
}

//Cart

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }
  setCart(cart);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  setCart(cart);
  renderCart();
}

function removeOneFromCart(id) {
  let cart = getCart();
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      cart = cart.filter(item => item.id !== id);
    }
  }

  setCart(cart);
  renderCart();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = count;
}

function renderCart() {
  const cart = getCart();
  cartItemsEl.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    total += product.price * item.quantity;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-white p-2 mb-2 rounded shadow";
    li.innerHTML = `
      <div>
        ${product.name} (x${item.quantity}) - $${(product.price * item.quantity).toFixed(2)}
      </div>
      <div>
      <button onclick="removeOneFromCart(${item.id})" class="bg-red-500 text-white px-2 py-1 rounded">Remove One</button>
      <button onclick="removeFromCart(${item.id})" class="bg-red-500 text-white px-2 py-1 rounded">Remove All</button>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });
  totalPriceEl.textContent = total.toFixed(2);
}

//Navigation

function navigateTo(page) {
  if (page === "home") {
    homePage.classList.remove("hidden");
    cartPage.classList.add("hidden");
  } else {
    homePage.classList.add("hidden");
    cartPage.classList.remove("hidden");
    renderCart();
  }
}
