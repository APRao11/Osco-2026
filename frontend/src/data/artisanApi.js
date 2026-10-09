const API_ROOT = 'http://localhost:3000/api';

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API_ROOT}${path}`, options);
  } catch {
    throw new Error('The OSCO backend is unavailable. Check that it is running and try again.');
  }

  let result = {};
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result.error || `The request failed (${response.status}).`);
  }
  return result;
}

function jsonOptions(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export async function loginArtisan(username, password) {
  const result = await request('/artisans/login', jsonOptions('POST', { username, password }));
  return result.artisan;
}

export async function getCrafts() {
  return request('/crafts');
}

export async function getArtisanProducts(artisanId) {
  return request(`/artisans/${artisanId}/products`);
}

export async function createProduct(product) {
  return request('/products', jsonOptions('POST', product));
}

export async function updateProduct(productId, product) {
  return request(`/products/${productId}`, jsonOptions('PATCH', product));
}

export async function deleteProduct(productId) {
  return request(`/products/${productId}`, { method: 'DELETE' });
}

export function normalizeProduct(product) {
  return {
    ...product,
    id: String(product.id),
    craft_id: Number(product.craft_id),
    craftId: Number(product.craft_id),
    category: product.craft_name || '',
    price: Number(product.price),
    stock: Number(product.stock) || 0,
    image: product.image || '',
    status: product.status || 'published',
    // The current product API/schema does not store per-product craft stories.
    craftStory: null,
  };
}