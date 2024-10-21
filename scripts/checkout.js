import {renderOrderSummary} from "./checkout/orderSummary.js";
import {renderCheckoutHeader} from "./checkout/checkoutHeader.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import { loadProductsFetch } from '../data/products.js';
import { loadCarts, loadCartsFetch } from "../data/cart.js";

async function loadPage() {
  try {
    // throw 'error1';
    // await loadProductsFetch();
    // await loadCartsFetch();
    await Promise.all([
      loadProductsFetch(),
      loadCartsFetch()
    ]);
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }

  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}

loadPage()

/*
Promise.all([
  loadProductsFetch(),

  new Promise((resolve) => {
    loadCarts(() => {
      resolve();
    });
  })

]).then((values) => {
  console.log(values);
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
});
*/

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve('value 1');
//   });

// }).then((value) => {
//   console.log(value);
//   return new Promise((resolve) => {
//     loadCarts(() => {
//       resolve();
//     });
//   }); 

// }).then (() => {
//   renderCheckoutHeader();
//   renderOrderSummary();
//   renderPaymentSummary();
// });

// loadProducts(()=> {
//   loadCarts(() => {
//     renderCheckoutHeader();
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
// });


