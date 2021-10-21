import items from "./itmes.json";
import { addToCart } from "./shoppingCart.js";
import formatCurrency from "./util/currencyFormatter.js";
const IMAGE_URL = "https://dummyimage.com/420x260/";
const storeItemsContainer = document.querySelector("[data-item-container]");
const storeItemTemplate = document.querySelector("#store-item-template");
export default function setupStore() {
  if (!storeItemsContainer) return;
  storeItemsContainer.textContent = "";
  items.forEach(renderItems);
  storeItemsContainer.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-add-to-cart-button]");
    if (!btn) return;
    const id = Number(btn.closest("[data-item]").dataset.itemId);
    addToCart(id);
  });
}

function renderItems(item) {
  const storeItemClone = storeItemTemplate.content.cloneNode(true);
  const storeItem = storeItemClone.querySelector("[data-item]");
  storeItem.dataset.itemId = item.id;
  const image = storeItemClone.querySelector("[data-image]");
  image.src = `${IMAGE_URL}${item.imageColor}/${item.imageColor}`;
  const category = storeItemClone.querySelector("[data-category]");
  category.textContent = item.category;
  const name = storeItemClone.querySelector("[data-name]");
  name.textContent = item.name;
  const price = storeItemClone.querySelector("[data-price]");
  price.textContent = formatCurrency(item.priceCents / 100);
  storeItemsContainer.appendChild(storeItem);
}
