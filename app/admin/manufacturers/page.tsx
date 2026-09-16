import React from 'react';
import { getManufacturers } from '@/lib/db';
import AdminManufacturersClient from './AdminManufacturersClient';

export const revalidate = 0;

export default async function AdminManufacturersPage() {
  const manufacturers = await getManufacturers();

  return (
    <div className="space-y-6">
      <AdminManufacturersClient initialManufacturers={manufacturers} />
    </div>
  );
}
