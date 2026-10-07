import React from 'react';
import { ProductForm } from '../components/ProductForm.jsx';

export function EditProduct({
  product,
  artisan,
  onSaveProduct,
  onCancel,
}) {
  return (
    <div className="py-2">
      <ProductForm
        initialProduct={product}
        artisan={artisan}
        isEditing={true}
        onSave={onSaveProduct}
        onCancel={onCancel}
      />
    </div>
  );
}