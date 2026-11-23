const SUPABASE_URL = "https://uwcbrhooaichuurkubpi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Y2JyaG9vYWljaHV1cmt1YnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExOTgzNTYsImV4cCI6MjEwNjc3NDM1Nn0.rpta8Loe5HnkO_-J_cjX-cwwyGW1YyHMLwFO44xtblE";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const products = [
  { id: 1, name: "Business Laptop", category: "Computers", price: 3499, stock: 10 },
  { id: 2, name: "IPhone17", category: "Phones", price: 299, stock: 25 },
  { id: 3, name: "Camera Device", category: "Samsung Camera", price: 180, stock: 0 },
  { id: 4, name: "HP Laptop", category: "Computers", price: 2999, stock: 4 },
  { id: 5, name: "Lenovo Laptop", category: "Computers", price: 2599, stock: 8 },
  { id: 6, name: "Wireless Mouse", category: "Accessories", price: 129, stock: 25 },
  { id: 7, name: "Keyboard", category: "Accessories", price: 199, stock: 3 },
  { id: 8, name: "USB-C Cable", category: "Accessories", price: 49, stock: 20 },
  { id: 9, name: "Headphones", category: "Accessories", price: 299, stock: 6 },
  { id: 10, name: "Smartphone", category: "Phones", price: 2499, stock: 0 },
  { id: 11, name: "iPhone 15", category: "Phones", price: 3299, stock: 5 },
  { id: 12, name: "Samsung Galaxy", category: "Phones", price: 2799, stock: 12 },
  { id: 13, name: "Google Pixel", category: "Phones", price: 2399, stock: 2 },
  { id: 14, name: "Tablet", category: "Computers", price: 1599, stock: 7 },
  { id: 15, name: "Webcam", category: "Accessories", price: 179, stock: 10 },
  { id: 16, name: "Gaming Monitor", category: "Computers", price: 1899, stock: 0 },
  { id: 17, name: "Power Bank", category: "Accessories", price: 99, stock: 1 }
];

// Display products
function renderProducts(list) {
  const container = document.getElementById("product-list");

  if (!container) {
    return;
  }

  container.replaceChildren();

  if (list.length === 0) {
    container.innerHTML = "<p>No products match your search.</p>";
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach(product => {
    const stockLabel =
      product.stock === 0
        ? "Out of Stock"
        : product.stock <= 5
          ? "Low Stock"
          : "In Stock";

    const id = product.product_id ?? product.id;
    const categoryName = (product.category && typeof product.category === 'object')
      ? product.category.category_name
      : (product.category || 'N/A');
    const card = document.createElement("article");
    card.className = "product";
    const heading = document.createElement("h3");
    heading.textContent = product.name;
    const category = document.createElement("p");
    category.textContent = `Category: ${categoryName}`;
    const price = document.createElement("p");
    price.textContent = `AED ${Number(product.price).toLocaleString()}`;
    const stock = document.createElement("p");
    stock.className = "stock";
    stock.textContent = stockLabel;
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = product.stock === 0 ? "Out of Stock" : "Add to Cart";
    addButton.disabled = product.stock === 0;
    addButton.addEventListener("click", () => addToCart({
      product_id: id,
      name: product.name,
      price: product.price
    }));
    const details = document.createElement("a");
    details.href = `product_details.html?id=${encodeURIComponent(id)}`;
    details.textContent = "View details";
    card.append(heading, category, price, stock, addButton, details);
    fragment.appendChild(card);
  });
  container.replaceChildren(fragment);
}

// Search
const searchBox = document.getElementById("search-box");

if (searchBox) {
  searchBox.addEventListener("input", function (event) {
    const term = event.target.value.toLowerCase();

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(term)
    );

    renderProducts(filteredProducts);
  });
}

// Category buttons
document.querySelectorAll(".category-btn").forEach(button => {
  button.addEventListener("click", function () {
    const category = button.dataset.category;

    if (category === "All") {
      renderProducts(products);
    } else {
      const filteredProducts = products.filter(
        product => product.category === category
      );

      renderProducts(filteredProducts);
    }
  });
});

// Sort products
const sortSelect = document.getElementById("sort-select");

if (sortSelect) {
  sortSelect.addEventListener("change", function (event) {
    let sortedProducts = [...products];

    if (event.target.value === "low-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (event.target.value === "high-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(sortedProducts);
  });
}

// Show all products when page loads
renderProducts(products);

async function loadProducts() {
  const { data: products, error } = await supabaseClient
    .from("product")
    .select("*, category(category_name)")
    .order("name");

  if (error) {
    document.getElementById("product-list").innerHTML =
      `<p>Could not load products: ${error.message}</p>`;
    return;
  }
  renderProducts(products);
}

// Only load products on pages that have a product list
if (document.getElementById("product-list")) {
  loadProducts();
}


// ===== CART HELPERS (Lab 5) =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item =>
    String(item.product_id) === String(product.product_id)
  );
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(product.name + " added to cart");
}

function removeFromCart(productId) {
  saveCart(getCart().filter(item =>
    String(item.product_id) !== String(productId)
  ));
}

function updateQuantity(productId, quantity) {
  quantity = Math.floor(Number(quantity));
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return removeFromCart(productId);
  }
  const cart = getCart().map(item =>
    String(item.product_id) === String(productId)
      ? { ...item, quantity }
      : item
  );
  saveCart(cart);
}

// ===== SHOW THE CART (used by cart.html) =====
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  if (!container) return; // does nothing on pages without a cart
  const checkoutLink = document.getElementById("checkout-link");
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("subtotal").textContent = "0.00";
    if (checkoutLink) checkoutLink.hidden = true;
    return;
  }
  let subtotal = 0;
  const fragment = document.createDocumentFragment();
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    const row = document.createElement("div");
    const name = document.createElement("span");
    name.textContent = item.name;
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.min = "1";
    quantity.step = "1";
    quantity.value = item.quantity;
    quantity.setAttribute("aria-label", `Quantity for ${item.name}`);
    quantity.addEventListener("change", () => {
      updateQuantity(item.product_id, quantity.value);
      renderCart();
    });
    const lineTotal = document.createElement("span");
    lineTotal.textContent = `AED ${(item.price * item.quantity).toFixed(2)}`;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeFromCart(item.product_id);
      renderCart();
    });
    row.append(name, quantity, lineTotal, removeButton);
    fragment.appendChild(row);
  });
  container.replaceChildren(fragment);
  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  if (checkoutLink) checkoutLink.hidden = false;
}

// ===== AUTH HELPERS (Lab 5) =====
async function updateNavForAuth() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  const navSlot = document.getElementById("auth-nav-slot");
  if (!navSlot) return;
  if (user) {
    navSlot.innerHTML = `<span>Hi, ${user.email}</span> <a href="#" onclick="logout()">Log out</a>`;
  } else {
    navSlot.innerHTML = `<a href="login.html">Login</a>`;
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

async function requireLogin() {
  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error) {
    console.error("Could not check the current user:", error);
    alert("Could not verify your login. Please try again.");
    return null;
  }
  if (!user) {
    const page = window.location.pathname.split("/").pop();
    const next = page === "order_confirmation.html"
      ? `${page}${window.location.search}`
      : page === "checkout.html" ? page : "products.html";
    window.location.href = `login.html?next=${encodeURIComponent(next)}`;
  }
  return user;
}

updateNavForAuth();

// =====================================================
// CHECKOUT AND ORDERS (Lab 6)
// =====================================================

// Show the cart contents on the checkout page
function renderCheckoutSummary() {
  const box = document.getElementById("checkout-summary");
  if (!box) return;

  const cart = getCart();
  if (cart.length === 0) {
    box.innerHTML = "<p>Your cart is empty.</p>";
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) checkoutForm.hidden = true;
    return;
  }
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) checkoutForm.hidden = false;

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const fragment = document.createDocumentFragment();
  cart.forEach(item => {
    const row = document.createElement("p");
    row.textContent =
      `${item.name} × ${item.quantity} — AED ${(Number(item.price) * item.quantity).toFixed(2)}`;
    fragment.appendChild(row);
  });
  const totalRow = document.createElement("h3");
  totalRow.textContent = `Total: AED ${total.toFixed(2)}`;
  fragment.appendChild(totalRow);
  box.replaceChildren(fragment);
}

renderCheckoutSummary();

// Create the Order and Order_Item rows
async function placeOrder(name, address, phone) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = "login.html";
    return false;
  }

  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return false;
  }

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  // 1. Create the order
  const { data: order, error } = await supabaseClient
    .from("order")
    .insert([{
      customer_id: user.id,
      total: subtotal,
      status: "Paid",
      shipping_name: name,
      shipping_address: address,
      shipping_phone: phone
    }])
    .select()
    .single();

  if (error) {
    console.error(error);
    const setupHint = error.code === "PGRST205"
      ? " Run supabase_order_schema.sql in your Supabase SQL Editor."
      : "";
    alert("Could not place order: " + error.message + setupHint);
    return false;
  }

  // 2. Create one order_item row per cart item
  const items = cart.map(item => ({
    order_id: order.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabaseClient
    .from("order_item")
    .insert(items);

  if (itemsError) {
    console.error(itemsError);
    const setupHint = itemsError.code === "PGRST205"
      ? " Run supabase_order_schema.sql in your Supabase SQL Editor."
      : "";
    alert("Could not save the order items: " + itemsError.message + setupHint);
    return false;
  }

  // 3. Only now that both inserts worked, clear the cart
  localStorage.removeItem("cart");
  window.location.href =
    `order_confirmation.html?id=${encodeURIComponent(order.order_id)}`;
  return true;
}

// Validate the checkout form, then place the order
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !address) {
      alert("Name and address are required.");
      return;
    }
    if (!/^[0-9+ ]{7,15}$/.test(phone)) {
      alert("Enter a valid phone number.");
      return;
    }

    const button = document.getElementById("place-order-btn");
    button.disabled = true; // stops double-clicking from creating two orders

    try {
      const ok = await placeOrder(name, address, phone);
      if (!ok) button.disabled = false;
    } catch (error) {
      console.error("Could not place order:", error);
      alert("Could not place order. Please try again.");
      button.disabled = false;
    }
  });
}