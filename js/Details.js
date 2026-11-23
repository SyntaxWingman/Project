const detailsContainer = document.getElementById("details");
const detailsProductId = new URLSearchParams(window.location.search).get("id");

async function loadProductDetails() {
  if (!detailsProductId) {
    detailsContainer.textContent = "No product was selected.";
    return;
  }

  const { data: product, error } = await supabaseClient
    .from("product")
    .select("*, category(category_name)")
    .eq("product_id", detailsProductId)
    .maybeSingle();

  if (error) {
    console.error("Could not load product details:", error);
    detailsContainer.textContent = `Could not load this product: ${error.message}`;
    return;
  }
  if (!product) {
    detailsContainer.textContent = "Product not found.";
    return;
  }

  const heading = document.createElement("h2");
  heading.textContent = product.name;
  const description = document.createElement("p");
  description.textContent = product.description || "No description available.";
  const price = document.createElement("p");
  price.textContent = `AED ${Number(product.price).toFixed(2)}`;
  const category = document.createElement("p");
  category.textContent =
    `Category: ${product.category?.category_name || "N/A"}`;
  const stock = document.createElement("p");
  stock.textContent = product.stock === 0 ? "Out of stock" : "In stock";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = product.stock === 0 ? "Out of Stock" : "Add to Cart";
  addButton.disabled = product.stock === 0;
  addButton.addEventListener("click", () => addToCart({
    product_id: product.product_id,
    name: product.name,
    price: product.price
  }));

  const cartLink = document.createElement("a");
  cartLink.href = "cart.html";
  cartLink.textContent = "View cart";
  detailsContainer.replaceChildren(
    heading, description, price, category, stock, addButton, cartLink
  );
}

loadProductDetails();
