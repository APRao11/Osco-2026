import React from 'react';
import { ProductForm } from '../components/ProductForm.jsx';

export function AddProduct({
  artisan,
  crafts,
  onSaveProduct,
  onCancel,
}) {
  return (
    <div className="artisan-product-page artisan-product-page-enter">
      <ProductForm
        artisan={artisan}
        crafts={crafts}
        isEditing={false}
        onSave={onSaveProduct}
        onCancel={onCancel}
      />
    </div>
  );
}