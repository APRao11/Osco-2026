export const API_ROOT = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');

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

  if (!response.ok) throw new Error(result.error || `The request failed (${response.status}).`);
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

export async function getArtisanProfile(artisanId) {
  const result = await request(`/artisans/${artisanId}/profile`);
  return result.artisan;
}

export async function updateArtisanProfile(artisanId, profile) {
  const result = await request(`/artisans/${artisanId}/profile`, jsonOptions('PATCH', profile));
  return result.artisan;
}

export async function getProduct(productId) {
  return request(`/products/${productId}`);
}

export async function getArtisanOrders(artisanId) {
  return request(`/artisans/${artisanId}/orders`);
}

export async function updateOrderStatus(orderId, artisanId, status) {
  return request(`/orders/${orderId}`, jsonOptions('PATCH', { artisan_id: artisanId, status }));
}

export async function createProduct(product) {
  return request('/products', jsonOptions('POST', product));
}

export async function updateProduct(productId, product, artisanId) {
  return request(`/products/${productId}${artisanId ? `?artisan_id=${artisanId}` : ''}`, jsonOptions('PATCH', product));
}

export async function deleteProduct(productId, artisanId) {
  return request(`/products/${productId}${artisanId ? `?artisan_id=${artisanId}` : ''}`, { method: 'DELETE' });
}

export async function submitCustomOrderRequest(requestData) {
  return request('/custom-orders', jsonOptions('POST', requestData));
}

export async function submitArtisanSupport(supportData) {
  return request('/support', jsonOptions('POST', supportData));
}

export function normalizeProduct(product) {
  const story = product.craft_story || null;
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
    craftStory: story ? {
      technique: story.technique || '',
      materials: story.materials || '',
      culturalSignificance: story.cultural_significance || '',
      storyBehindCraft: story.story_behind_craft || '',
      makingTime: story.making_time || '',
    } : null,
  };
}

export function normalizeArtisan(record) {
  return {
    ...record,
    email: record.username || '',
    photo: record.photo || '',
    workshopName: record.workshop_name || '',
    craftSpeciality: record.craft_speciality || '',
    craftBackground: record.craft_background || '',
    makerStory: record.maker_story || '',
    yearsOfExperience: record.years_of_experience ?? '',
  };
}

export function artisanProfilePayload(profile) {
  return {
    name: profile.name,
    location: profile.location,
    bio: profile.bio,
    photo: profile.photo,
    workshop_name: profile.workshopName,
    craft_speciality: profile.craftSpeciality,
    craft_background: profile.craftBackground,
    maker_story: profile.makerStory,
    years_of_experience: Number(profile.yearsOfExperience) || 0,
  };
}

export function productPayload(product) {
  return {
    craft_id: Number(product.craft_id),
    artisan_id: Number(product.artisan_id),
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image || null,
    stock: Number(product.stock) || 0,
    status: product.status,
    craft_story: product.craftStory ? {
      technique: product.craftStory.technique || '',
      materials: product.craftStory.materials || '',
      cultural_significance: product.craftStory.culturalSignificance || '',
      story_behind_craft: product.craftStory.storyBehindCraft || '',
      making_time: product.craftStory.makingTime || '',
    } : null,
  };
}
