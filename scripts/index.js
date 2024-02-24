import { products } from "../data/products.js"
import { cart, addToCart, saveToStorage } from "../data/cart.js"
import formatCurrency from "./utils/formatCurrency.js";
updateCart();
renderProducts(products);

function renderProducts(productArray) {
  let productsHtml = "";
  productArray.forEach(product => {
    productsHtml += `
    <div class="product-container">
      <div class="product-image-container">
        <img
          class="product-image"
          src="${product.image}"
        />
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img
          class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png"
        />
        <div class="product-rating-count link-primary">${product.rating.count}</div>
      </div>

      <div class="product-price">$${formatCurrency(product.priceCents)}</div>

      <div class="product-quantity-container">
        <select class="select-quantity">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10" >10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png" />
        Added
      </div>

      <button class="add-to-cart-button button-primary" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `
  });
  const productGridElement = document.querySelector(".products-grid")
  if (productGridElement) {
    document.querySelector(".products-grid").innerHTML = productsHtml;
  }
  document.querySelectorAll(".add-to-cart-button").forEach(button => {
    button.addEventListener("click", (evt) => {
      const notification = evt.target.previousElementSibling;
      notification.style.opacity = 1;
      setTimeout(() => {
        notification.style.opacity = 0;
      }, 1000);
      const productId = button.dataset.productId;
      const selectElement = evt.target.parentElement.querySelector(".select-quantity");
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      const selectedValue = selectedOption.value;
      addToCart(productId, selectedValue);
      updateCart();
      setTimeout(() => {
        selectElement.selectedIndex = 0;
      }, 500);
    })
  });

}



export function updateCart() {
  let cartQuantity = 0;
  cart.forEach(item => {
    cartQuantity += item.quantity;
  });
  saveToStorage();
  let cartQuantityElement = document.querySelector(".cart-quantity");
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

const cartLink = document.querySelector(".cart-link");
if (cartLink) {
  cartLink.addEventListener("click", () => {
    console.log("cartLink clicked")
    if (cart.length === 0) {
      window.location.href = '../empty-cart.html';
    }
    else {
      window.location.href = '../checkout.html';
    }
  })

}

let searchResults;

const searchBarElement = document.querySelector(".search-bar");
const searchButtonElement = document.querySelector(".search-button");
let searchTerm;
if (searchBarElement) {
  searchBarElement.addEventListener("keydown", (evt) => {

    if (evt.key === "Enter") {
      searchForProducts();
    }
  });
}
if (searchButtonElement) {
  searchButtonElement.addEventListener("click", (evt) => {
    searchForProducts();
  });

}

function searchForProducts() {
  searchResults = [];
  searchTerm = searchBarElement.value.toLowerCase();
  searchProducts(searchTerm);
  if (searchProducts.length > 0) {
    renderProducts(searchResults);
  }
  else {
    document.querySelector(".products-grid").innerHTML = "<h1>No products matching your search were found</h1>";
  }
}
function searchProducts(searchTerm) {
  if (searchTerm == "") {
    window.location.replace("../index.html");
  }
  products.forEach(product => {
    if (product.name.toLowerCase().includes(searchTerm) || product.keywords.includes(searchTerm)) {
      searchResults.push(product);
    }
  })

}
