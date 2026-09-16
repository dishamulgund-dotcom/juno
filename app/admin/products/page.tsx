import React from 'react';
import { getProducts } from '@/lib/db';
import AdminProductsClient from './AdminProductsClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getProducts({ includeDrafts: true });

  return (
    <div className="space-y-6">
      <AdminProductsClient initialProducts={products} />
    </div>
  );
}
