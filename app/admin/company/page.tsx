import React from 'react';
import { getCorporateProfile } from '@/lib/db';
import AdminCompanyClient from './AdminCompanyClient';

export const revalidate = 0;

export default async function AdminCompanyPage() {
  const profile = await getCorporateProfile();

  return (
    <div className="space-y-6">
      <AdminCompanyClient initialProfile={profile} />
    </div>
  );
}
