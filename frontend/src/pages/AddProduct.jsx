import React from 'react';
import { ProductForm } from '../components/ProductForm.jsx';

export function AddProduct({
  artisan,
  onSaveProduct,
  onCancel,
}) {
  return (
    <div className="artisan-product-page artisan-product-page-enter">
      <ProductForm
        artisan={artisan}
        isEditing={false}
        onSave={onSaveProduct}
        onCancel={onCancel}
      />
    </div>
  );
}