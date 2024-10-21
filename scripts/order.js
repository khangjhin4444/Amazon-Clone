import { renderOrders } from "./order/orderSummary.js";
import { loadProductsFetch } from "../data/products.js";

async function loadPage() {
  await loadProductsFetch();
  renderOrders();
}

loadPage();
