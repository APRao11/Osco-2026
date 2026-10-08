const STORAGE_KEY = 'osco.orders.v1';

function readOrders() {
  try {
    const savedOrders = window.localStorage.getItem(STORAGE_KEY);
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export function createLocalOrder({ product, buyerName, phone, address, quantity }) {
  const orders = readOrders();
  const order = {
    id: `${Date.now()}`,
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    craftName: product.craft_name ?? product.craftName ?? '',
    artisanName: product.artisan_name ?? product.artisanName ?? 'Local artisan',
    unitPrice: Number(product.price),
    quantity: Number(quantity),
    buyerName: buyerName.trim(),
    phone: phone.trim(),
    address: address.trim(),
    total: Number(product.price) * Number(quantity),
    status: 'placed',
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...orders, order]));
  return order;
}

export function getLocalOrder(orderId) {
  return readOrders().find((order) => order.id === orderId) ?? null;
}
