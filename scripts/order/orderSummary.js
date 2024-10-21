import { orders } from "../../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import formatCurrency from "../utils/money.js";
import {getProduct} from "../../data/products.js"
import { cart } from "../../data/cart-class.js";
import { updateCartQuantity } from "../amazon.js";

export function renderOrders() {
  updateCartQuantity();
  let html = '';
  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format('MMMM D');
    html += `
      <div class="order-container">
          
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${renderCartItems(order)}
        </div>
      </div>
    `;
  });

  function renderCartItems(order) {
    let html = '';
    order.products.forEach((product) => {
      const estimatedDeliveryString = dayjs(product.estimatedDeliveryTime).format('MMMM D');
      let matchingProduct;
      matchingProduct = getProduct(product.productId);
      html += `
        <div class="product-image-container">
          <img src=${matchingProduct.image}>
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${estimatedDeliveryString}
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button class="buy-again-button button-primary"
          data-product-id="${matchingProduct.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${matchingProduct.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });
    return html;
  };
  
  document.querySelector('.js-orders-grid').innerHTML = html;
  document.querySelectorAll('.buy-again-button').forEach((link) =>{
    link.addEventListener('click', () => {
      const id = link.dataset.productId;
      cart.addToCart(id);
    });
  });
};

