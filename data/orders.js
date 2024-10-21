

export const orders = JSON.parse(localStorage.getItem('orders')) || [];



export function addOrders(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrder(orderId) {
  let matchingOrder;
  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order
    };
  });
  return matchingOrder;
};

export function getProductOrder(orderId, productId) {
  let matchingProduct;
  orders.forEach((order) => {
    if(order.id === orderId) {
      order.products.forEach((product) => {
        if (product.productId === productId) {
          matchingProduct = product
        };
      }); 
    } 
  });
  return matchingProduct;
}