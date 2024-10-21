import { renderOrders } from "./order/orderSummary.js";
import { loadProductsFetch } from "../data/products.js";

async function loadPage() {
  await loadProductsFetch();
  renderOrders();
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
