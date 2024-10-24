import {cart} from '../data/cart-class.js';
import {products, loadProducts, loadProductsFetch} from '../data/products.js';
import { formatCurrency } from './utils/money.js';

let isSearched = false;
let found = false;
const url = new URL(window.location.href);
let searchText;
if (url.searchParams.get('search')) {
  isSearched = true;
  searchText = url.searchParams.get('search').toLowerCase();
} else isSearched = false;

async function loadPage() {
  await loadProductsFetch();
  renderProductsGrid();
}

loadPage();

function renderProductsGrid() {
  let productsHTML = '';
  updateCartQuantity();
  products.forEach((product) => {
    if (isSearched) {
      if (product.name.toLowerCase().includes(searchText) || product.keywords.includes(searchText)) {
        found = true;
        productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-product-quantity-container-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;
      }
    } else {
      productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-product-quantity-container-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;
    }
  });
  if (isSearched && found || !isSearched) {
    document.querySelector('.js-products-grid').innerHTML = productsHTML;
  } else if (isSearched && !found) {
    document.querySelector('.main').classList.add('not-found');
    document.querySelector('.main').innerHTML = "Not Found Matching Products!";
  }

  

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const quantity = document.querySelector(`.js-product-quantity-container-${productId}`).value;
        for (let i = 0; i < quantity; i++) {
          cart.addToCart(productId);
        }
        updateCartQuantity();
      });
    });
    
};

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  })
  if (cartQuantity === 0) {
    document.querySelector('.js-cart-quantity')
      .innerHTML = '';
  } else document.querySelector('.js-cart-quantity')
  .innerHTML = `${cartQuantity}`;
};

document.querySelector('.search-button').addEventListener('click',() => {
  const text = document.querySelector('.search-bar').value;
  window.location.href = `../amazon.html?search=${text}`;
});

document.querySelector('.search-bar').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const text = document.querySelector('.search-bar').value;
    window.location.href = `../amazon.html?search=${text}`;
  }
});