import React from 'react';
import { getEnquiries } from '@/lib/db';
import AdminEnquiriesClient from './AdminEnquiriesClient';

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div className="space-y-6">
      <AdminEnquiriesClient initialEnquiries={enquiries} />
    </div>
  );
}
