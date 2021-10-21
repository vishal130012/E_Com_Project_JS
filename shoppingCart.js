import items from "./itmes.json";
import formatCurrency from "./util/currencyFormatter.js";
const cartButton = document.querySelector("[data-cart-button]");
const cartItemTemplate = document.querySelector("#cart-item-template");
const cartItemsContainer = document.querySelector("[data-cart-item-container]");
const shoppingCartEl = document.querySelector("[data-shopping-cart]");
const IMAGE_URL = "https://dummyimage.com/210x130/";
let shoppingCart = getCartItem() || [];

export default function setupShoppingCart() {
  renderCart();
  cartButton.addEventListener("click", (evt) => {
    shoppingCartEl.classList.toggle("invisible");
  });
  handleDeleteItem();
}
export function addToCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({ id: id, quantity: 1 });
    storeCart();
  }
  renderCart();
}
function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart();
  } else {
    showCart();
    renderCartItem();
  }
}
function renderCartItem() {
  cartItemsContainer.textContent = "";
  shoppingCart.forEach((shoppingCartItem) => {
    const item = items.find((item) => item.id === shoppingCartItem.id);
    shoppingCartItem.details = item;
    const cartItemClone = cartItemTemplate.content.cloneNode(true);
    const cartItem = cartItemClone.querySelector("[data-cart]");
    cartItem.dataset.itemId = item.id;
    const image = cartItemClone.querySelector("[data-image]");
    image.src = `${IMAGE_URL}${item.imageColor}/${item.imageColor}`;
    const name = cartItemClone.querySelector("[data-name]");
    name.textContent = item.name;
    const price = cartItemClone.querySelector("[data-price]");
    price.textContent = formatCurrency(item.priceCents / 100);
    const itemsCount = cartItemClone.querySelector("[data-item-count]");
    if (shoppingCartItem.quantity > 1) {
      itemsCount.textContent = `x${shoppingCartItem.quantity}`;
    } else {
      itemsCount.textContent = ``;
    }
    cartItemsContainer.appendChild(cartItem);
  });
  calcualteItemCount();
  calculateGrandTotal();
}
function calculateGrandTotal() {
  document.querySelector("[data-cart-total]").textContent = formatCurrency(
    shoppingCart.reduce((acc, item) => {
      return (acc += Number(item.details.priceCents) * item.quantity);
    }, 0) / 100
  );
}
function calcualteItemCount() {
  document.querySelector("[data-cart-item-count]").textContent =
    shoppingCart.length;
}
function hideCart() {
  document
    .querySelector("[data-shopping-cart-section]")
    .classList.add("invisible");
  shoppingCartEl.classList.add("invisible");
}
function showCart() {
  document
    .querySelector("[data-shopping-cart-section]")
    .classList.remove("invisible");
}
function handleDeleteItem() {
  cartItemsContainer.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-remove-from-cart-button]");
    if (!btn) return;
    const currentId = btn.closest("[data-item-id]").dataset.itemId;
    if (!currentId) return;
    const existingItem = shoppingCart.find(
      (entry) => entry.id === Number(currentId)
    );
    shoppingCart.splice(shoppingCart.indexOf(existingItem), 1);
    renderCart();
    storeCart();
  });
}
function storeCart() {
  window.localStorage.setItem("cart_app_store", JSON.stringify(shoppingCart));
}
function getCartItem() {
  return JSON.parse(window.localStorage.getItem("cart_app_store"));
}
