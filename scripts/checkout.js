import { products } from '../data/products.js'
import { cart, removeFromCart, updateDeliveryOption } from '../data/cart.js'
import { deliveryOptions } from '../data/deliveryOptions.js';
import formatCurrency from './utils/formatCurrency.js';
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { renderPaymentSummary } from './payment.js';
import { updateCart } from './index.js';


let cartSummaryHtml = '';

function renderCartItems() {
  document.querySelector(".return-to-home-link").textContent = `${cart.length} items`;
  cart.forEach(cartItem => {
    let date = dayjs();
    const productId = cartItem.productId;
    let matchingProduct = products.find(product => product.id === productId);
    let deliveryDate = date.add(deliveryOptions.find(option => option.id === cartItem.deliveryOptionId)["deliveryDays"], 'day').format("dddd, MMMM D");

    cartSummaryHtml +=
      `
    <div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">Delivery date: ${deliveryDate}</div>
      <div class="cart-item-details-grid">
        <img
          class="product-image"
          src="${matchingProduct.image}"
        />

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
          <div class="product-quantity">
            <span> Quantity: <span class="quantity-label">${cartItem.quantity}</span> </span>
            <input type="text" id="update-quantity-input"  />
            <button class="confirm-update-button">Confirm</button>
            <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <span class="delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Delete
            </span>             
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
        ${deliveryOptionHtml(matchingProduct, cartItem)}  
        </div>
      </div>
    </div>
    `
  });
}
renderCartItems();
renderPaymentSummary();

function deliveryOptionHtml(matchingProduct, cartItem) {
  let html = '';
  let date = dayjs();


  deliveryOptions.forEach((deliveryOption, index) => {
    const dateString = date.add(deliveryOption.deliveryDays, 'day').format("dddd, MMMM D");
    const pricingString = (deliveryOption.priceCents == 0) ? "Free shipping" : `$  ${formatCurrency(deliveryOption.priceCents)} shipping`;
    const isChecked = cartItem.deliveryOptionId === deliveryOption.id;

    html += `
    <div class="delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id=${deliveryOption.id}>
      <input  ${isChecked ? "checked" : ""}
        type="radio"
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">${pricingString}</div>
      </div>
    </div>
    `
  })
  return html;
}

document.querySelector(".order-summary").innerHTML = cartSummaryHtml;


document.querySelectorAll(".delete-quantity-link").forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.getAttribute('data-product-id');
    removeFromCart(productId);
    renderPaymentSummary();
  })
})

document.querySelectorAll(".delivery-option").forEach((deliveryOption) => {
  deliveryOption.addEventListener("click", (evt) => {
    const productId = deliveryOption.getAttribute('data-product-id');
    const deliveryOptionId = deliveryOption.getAttribute('data-delivery-option-id');
    updateDeliveryOption(productId, deliveryOptionId);
    let dataElement = document.getElementsByClassName(`js-cart-item-container-${productId}`)[0].firstElementChild;
    dataElement.innerText = `Delivery date: ${evt.target.nextElementSibling.firstElementChild.textContent}`;
    renderPaymentSummary();
  })
})


document.querySelectorAll(".update-quantity-link").forEach(link => {
  link.addEventListener("click", () => {
    const quantityLabel = link.parentElement.querySelector(".quantity-label");
    const inputField = link.parentElement.querySelector("#update-quantity-input");
    const confirmButton = link.parentElement.querySelector(".confirm-update-button");
    const productId = link.getAttribute("data-product-id");
    quantityLabel.style.display = "none";
    link.style.display = "none";

    inputField.value = quantityLabel.innerText;
    inputField.style.display = "inline-block";
    confirmButton.style.display = "inline-block";
    inputField.focus()
    confirmButton.addEventListener("click", () => {
      updateQuantity(quantityLabel, inputField, confirmButton, link, productId);
    });
    // inputField.addEventListener("keydown", (evt) => {
    //   if (evt.key == "Enter" ) {
    //     updateQuantity(quantityLabel, inputField, confirmButton, link,productId);
    //   }
    // });
  });
});

function updateQuantity(quantityLabel, inputField, confirmButton, link, productId) {
  const newQuantity = Number(inputField.value);
  quantityLabel.innerText = newQuantity;
  let machingCartItem = cart.find(item => item.productId === productId);
  machingCartItem.quantity = newQuantity;
  if (newQuantity < 0) {
    alert("Invalid item quantity");
  }
  else if (inputField.value > 10) {
    alert("The quantity per item in the cart can't exceed 10 items");
  }
  else if (newQuantity === 0) {
    removeFromCart(productId);
    renderCartItems();
    renderPaymentSummary();
  }
  else {
    updateCart();
    renderCartItems();
    renderPaymentSummary();
    inputField.style.display = "none";
    confirmButton.style.display = "none";
    link.style.display = "inline-block";
    quantityLabel.style.display = "inline-block";
  }

}
