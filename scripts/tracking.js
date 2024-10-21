import { getProduct, loadProductsFetch } from "../data/products.js";
import { getOrder, getProductOrder } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'

import { cart } from "../data/cart-class.js";


const url = new URL(window.location.href);
console.log(url.searchParams.get('orderId'));
console.log(url.searchParams.get('productId'));

async function loadPage() {
  await loadProductsFetch();
  renderTracking();
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
}
 
loadPage();

function updateCartQuantity() {
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

function renderTracking() {
  updateCartQuantity();
  const matchingOrder = getOrder(url.searchParams.get('orderId'));
  const matchingProductOrder = getProductOrder(url.searchParams.get('orderId'), url.searchParams.get('productId'));
  const matchingProduct = getProduct(url.searchParams.get('productId'));
  console.log(matchingProductOrder);
  const estimatedDeliveryString = dayjs(matchingProductOrder.estimatedDeliveryTime).format('MMMM D');
  let today = dayjs();
  const orderTime = dayjs(matchingOrder.orderTime);
  const deliveryTime = dayjs(matchingProductOrder.estimatedDeliveryTime);
  const percents = 
    (today.diff(orderTime, 'days') / deliveryTime.diff(orderTime, 'days')) * 100;
  let html = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${estimatedDeliveryString}
    </div>

    <div class="product-info">
      ${matchingProduct.name}
    </div>

    <div class="product-info">
      Quantity: ${matchingProductOrder.quantity}
    </div>

    <img class="product-image" src=${matchingProduct.image}>

    <div class="progress-labels-container">
      <div class="progress-label js-progress-49">
        Preparing
      </div>
      <div class="progress-label js-progress-99">
        Shipped
      </div>
      <div class="progress-label js-progress-100">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width:${percents}%"></div>
    </div>
  `;
  document.querySelector('.order-tracking').innerHTML = html;
  document.querySelector('.progress-label').classList.remove('current-status');
  if (percents <= 49) {
    document.querySelector('.js-progress-49').classList.add('current-status');
  } else if (percents > 49 && percents <= 99) {
    document.querySelector('.js-progress-99').classList.add('current-status');
  } else {
    document.querySelector('.js-progress-100').classList.add('current-status');
  }
}

