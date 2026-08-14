// mobile navbar toggler
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

navToggler.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// header active & scroll to top
const header = document.querySelector("[data-header]");
const goTop = document.querySelector(".to-top");

goTop.addEventListener("click", () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

window.addEventListener("scroll", () => {
  header.classList[window.scrollY > 50 ? "add" : "remove"]("active");
  scrollFunction();
});

function scrollFunction() {
  if (
    document.body.scrollTop > 700 ||
    document.documentElement.scrollTop > 700
  ) {
    goTop.classList.add("show");
  } else {
    goTop.classList.remove("show");
  }
}

// Animation
ScrollReveal({
  reset: false,
  distance: "60px",
  duration: 1500,
  delay: 300,
});

ScrollReveal().reveal(".slide-left", { delay: 200, origin: "left" });
ScrollReveal().reveal(".slide-right", { delay: 300, origin: "bottom" });

// =====================================
// DATA FETCHING & RENDERING
// =====================================
let productsData = [];

async function fetchProducts() {
  try {
    const res = await fetch("./data/products.json");
    productsData = await res.json();
    renderProducts();
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

function createProductCardHTML(product) {
  return `
    <li class="scrollbar-item">
      <div class="product-card">
        <div class="card-banner">
          <figure class="product-banner img-holder" style="--width:448; --height:470;">
            <img src="${product.image}" width="448" height="470" loading="lazy" alt="${product.name}" class="img-cover">
          </figure>
          <button class="btn product-btn" onclick="addToCart(${product.id})">
            <ion-icon name="bag" aria-hidden="true"></ion-icon>
            <span class="span">Add To Cart</span>
          </button>
        </div>
        <div class="card-content">
          <h3 class="h4 title">
            <a href="#" class="card-title">${product.name}</a>
          </h3>
          <span class="price">$${product.price.toFixed(2)}</span>
        </div>
      </div>
    </li>
  `;
}

function renderProducts() {
  const newArrivalsList = document.getElementById("new-arrivals-list");
  const featuredList = document.getElementById("featured-list");

  if (newArrivalsList) {
    const newArrivals = productsData.filter(p => p.category === "new-arrivals");
    newArrivalsList.innerHTML = newArrivals.map(createProductCardHTML).join('');
  }

  if (featuredList) {
    const featured = productsData.filter(p => p.category === "featured");
    // The previous featured layout used li classes (left, center, right).
    // We'll simplify and use a grid via CSS (which is already configured).
    featuredList.innerHTML = featured.map(p => `
      <li>
        <div class="product-card text-center">
          <div class="card-banner">
            <figure class="product-banner img-holder" style="--width: 448; --height: 470;">
              <img src="${p.image}" width="448" height="470" loading="lazy" alt="${p.name}" class="img-cover">
            </figure>
            <button class="btn product-btn" onclick="addToCart(${p.id})">
              <ion-icon name="bag" aria-hidden="true" role="img" class="md hydrated"></ion-icon>
              <span class="span">Add To Cart</span>
            </button>
          </div>
          <div class="card-content">
            <h3 class="h3 title">
              <a href="#" class="card-title">${p.name}</a>
            </h3>
            <span class="price">$${p.price.toFixed(2)}</span>
          </div>
        </div>
      </li>
    `).join('');
  }
}

// =====================================
// CART LOGIC
// =====================================
let cart = JSON.parse(localStorage.getItem('shoppie_cart')) || [];

const cartSidebar = document.querySelector("[data-cart-sidebar]");
const cartCloseBtn = document.querySelector("[data-cart-close]");
const overlay = document.querySelector("[data-overlay]");
const cartOpenBtn = document.querySelector(".cart-btn");
const cartBadge = document.querySelector(".cart-btn .span");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");

function toggleCart() {
  cartSidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

if(cartOpenBtn) cartOpenBtn.addEventListener("click", toggleCart);
if(cartCloseBtn) cartCloseBtn.addEventListener("click", toggleCart);
if(overlay) overlay.addEventListener("click", toggleCart);

// Make functions global so inline onclick can use them
window.addToCart = function(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  showToast(`Added ${product.name} to cart!`);
}

window.updateQuantity = function(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
    }
  }
}

window.removeFromCart = function(productId) {
  cart = cart.filter(i => i.id !== productId);
  updateCart();
}

function updateCart() {
  localStorage.setItem('shoppie_cart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  // Update header badge
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = `Cart (${totalItems.toString().padStart(2, '0')})`;
  }

  // Render items
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalPrice.textContent = '$0.00';
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map(item => {
    total += item.price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-actions">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <input type="text" value="${item.quantity}" readonly>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>
    `;
  }).join('');

  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}


// =====================================
// TOAST NOTIFICATIONS
// =====================================
const toastContainer = document.getElementById("toast-container");

function showToast(message) {
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  
  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Remove toast
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300); // Wait for transition
  }, 3000);
}


// =====================================
// NEWSLETTER VALIDATION
// =====================================
const newsletterForm = document.getElementById("newsletter-form");
const newsletterEmail = document.getElementById("newsletter-email");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (newsletterEmail.value) {
      showToast("Thanks for subscribing to our newsletter!");
      newsletterEmail.value = "";
    }
  });
}

// Initialize
fetchProducts();
renderCart();
