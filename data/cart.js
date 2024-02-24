export let cart = JSON.parse(localStorage.getItem('cart')) ||
  [];

/*
let cart ={
  productId: "some-product-id",
  quantity: 1,
  deliveryOptionId: "1"
}
*/
export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId,quantity) {
  const matchingProduct = cart.find(item => item.productId === productId);
  quantity =Number(quantity);
  if (matchingProduct) {
    matchingProduct.quantity+=quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1"
    });
  }  
  saveToStorage();
}


export function removeFromCart(productId) {
  cart.forEach((cartItem, index) => {
    if (cartItem.productId === productId) {
      cart.splice(index, 1);
      saveToStorage();
    }
  })
  document.querySelector(".return-to-home-link").textContent = `${cart.length} items`;
  console.log(`.js-cart-item-container-${productId}`)
  document.querySelector(`.js-cart-item-container-${productId}`).remove();
  if (cart.length === 0) {
    window.location.replace("../empty-cart.html")
  }
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingProduct;
  cart.forEach(item => {
    if (item.productId === productId) {
      matchingProduct = item;
    }
  });
  matchingProduct.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
