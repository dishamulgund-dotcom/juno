import React from 'react';
import { getCompanyStats } from '@/lib/db';
import AdminStatsClient from './AdminStatsClient';

export const revalidate = 0;

export default async function AdminStatsPage() {
  const stats = await getCompanyStats();

  return (
    <div className="space-y-6">
      <AdminStatsClient initialStats={stats} />
    </div>
  );
}
