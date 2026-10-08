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

function saveOrder(order) {
  const orders = readOrders().filter((savedOrder) => String(savedOrder.id) !== String(order.id));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...orders, order]));
  return order;
}

export function normalizeServerOrder(order) {
  return {
    id: String(order.id),
    productId: order.product_id,
    productName: order.product_name,
    productImage: order.product_image,
    craftName: order.craft_name ?? '',
    artisanName: order.artisan_name ?? 'Local artisan',
    unitPrice: Number(order.unit_price),
    quantity: Number(order.quantity),
    buyerName: order.buyer_name,
    buyerEmail: order.buyer_email ?? '',
    phone: order.buyer_phone,
    address: order.buyer_address,
    total: Number(order.total_price),
    status: order.status,
    createdAt: order.created_at ?? new Date().toISOString(),
  };
}

export function saveServerOrder(order) {
  return saveOrder(normalizeServerOrder(order));
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

  return saveOrder(order);
}

export function getLocalOrder(orderId) {
  return readOrders().find((order) => order.id === orderId) ?? null;
}
