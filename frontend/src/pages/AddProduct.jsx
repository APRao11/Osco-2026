import React from 'react';
import { ProductForm } from '../components/ProductForm.jsx';

export function AddProduct({
  artisan,
  onSaveProduct,
  onCancel,
}) {
  return (
    <div className="animate-fadeIn py-2">
      <ProductForm
        artisan={artisan}
        isEditing={false}
        onSave={onSaveProduct}
        onCancel={onCancel}
      />
    </div>
  );
}