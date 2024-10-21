import {cart} from '../../data/cart-class.js';

export function renderCheckoutHeader() {
  let html = `
    Checkout (<a class="return-to-home-link js-return-to-home-link"
            href="amazon.html"></a>)
  `;
  document.querySelector('.checkout-header-middle-section').innerHTML = html;
}
renderCheckoutHeader();
export function updateHeaderItems() {
  let cartQuantity = cart.calculateCartQuantity();
  if (cartQuantity === 0) {
    document.querySelector('.js-return-to-home-link')
      .innerHTML = '0 item';
  } else document.querySelector('.js-return-to-home-link')
  .innerHTML = `${cartQuantity} items`;
  
};