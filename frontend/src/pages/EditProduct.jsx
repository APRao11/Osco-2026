import React from 'react';
import { ProductForm } from '../components/ProductForm.jsx';

export function EditProduct({
  product,
  artisan,
  crafts,
  onSaveProduct,
  onCancel,
}) {
  return (
    <div className="artisan-product-page">
      <ProductForm
        initialProduct={product}
        crafts={crafts}
        artisan={artisan}
        isEditing={true}
        onSave={onSaveProduct}
        onCancel={onCancel}
      />
    </div>
  );
}