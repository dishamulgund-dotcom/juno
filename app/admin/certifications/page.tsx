import React from 'react';
import { getCertifications } from '@/lib/db';
import AdminCertificationsClient from './AdminCertificationsClient';

export const revalidate = 0;

export default async function AdminCertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="space-y-6">
      <AdminCertificationsClient initialCertifications={certifications} />
    </div>
  );
}
