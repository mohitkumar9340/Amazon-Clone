import { cart } from "../data/cart.js";
import { products } from "../data/products.js";
import formatCurrency from "./utils/formatCurrency.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

export function renderPaymentSummary() {
  let orderPrice = 0;
  let deliveryPrice = 0;
  let totalPrice = 0;
  const taxRate = 0.1;

  cart.forEach(cartItem => {
    const productId = cartItem.productId;
    const deliveryOptionId = cartItem.deliveryOptionId;
    const matchingProduct = products.find(product => product.id === productId);
    const productPrice = matchingProduct.priceCents;//in cents
    const itemPrice = cartItem.quantity * productPrice;//in cents
    orderPrice += itemPrice;

    deliveryPrice += calculateDeliveryPrice(deliveryOptionId);
  });
  totalPrice = orderPrice + deliveryPrice;

  let totalTax = totalPrice * taxRate;
  let finalPrice = totalPrice + totalTax;
  let paymentSummaryHtml = `
    <div class="payment-summary-title">Order Summary</div>

      <div class="payment-summary-row">
        <div>Items (${cart.length}):</div>
        <div class="payment-summary-money">$${formatCurrency(orderPrice)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(deliveryPrice)}</div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatCurrency(totalPrice)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${formatCurrency(totalTax)}</div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(finalPrice)}</div>
      </div>

      <button class="place-order-button button-primary">
        Place your order
      </button>
  `;

  document.getElementsByClassName("payment-summary")[0].innerHTML = paymentSummaryHtml;

}

function calculateDeliveryPrice(deliveryOptionId) {
  let matchingDeliveryOption = deliveryOptions.find(deliveryOption => deliveryOption.id === deliveryOptionId);
  return matchingDeliveryOption.priceCents;
}
