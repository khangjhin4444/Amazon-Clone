import {cart} from '../../data/cart-class.js';
import { getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js';
import { updateHeaderItems } from './checkoutHeader.js';

export function renderOrderSummary() {

  updateHeaderItems();


  let cartSummaryHTML = '';
  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
    <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}
    js-cart-item-container">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link"
            data-product-id = "${matchingProduct.id}">
              Update 
            </span>
            <input class="quantity-input js-input-${productId}" data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-link"
            data-product-id ="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link
            js-delete-link-${matchingProduct.id}"
            data-product-id = "${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>

          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html ='';
    deliveryOptions.forEach(deliveryOption => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString = Number(deliveryOption.priceCents) !== 0? `$${formatCurrency(deliveryOption.priceCents)} - Shipping`: 'FREE Shipping';
      const isCheck = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
      data-product-id = "${matchingProduct.id}"
      data-delivery-id = ${deliveryOption.id}>
        <input type="radio" 
          ${isCheck? 'checked' : ''}
          class="delivery-option-input
          js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString}
          </div>
        </div>
      </div>
      `;
    });

    return html;
  }

  document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);

      renderOrderSummary();
      updateHeaderItems();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      updateSave(link);
    });
  });

  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') updateSave(input);
    })

  });

  function updateSave(link) {
    const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      const inputElement = document.querySelector(`.js-input-${productId}`);
      const newQuantity =  Number(inputElement.value);

      if (newQuantity <= 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      }

      cart.updateQuantity(productId, newQuantity);
      updateHeaderItems();
      renderOrderSummary();
      container.classList.remove('is-editing-quantity');
      inputElement.value = '';
      renderPaymentSummary();
  };


  document.querySelectorAll('.js-delivery-option').forEach(element => {
    element.addEventListener('click', () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryId;
      console.log(productId);
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
};


function calculateDeliveryDate(deliveryOption) {
  let deliveryDate = dayjs();
  let count = deliveryOption.deliveryDays;
  while (count > 0) {
    deliveryDate = deliveryDate.add(1, 'days'); // Add 1 day at a time

    // Check if the day is not a weekend (Saturday or Sunday)
    if (deliveryDate.format('dddd') !== 'Sunday' && deliveryDate.format('dddd') !== 'Saturday') {
      count--;
    }
  }
  const dateString = deliveryDate.format('dddd, MMMM D');
  return dateString;
}