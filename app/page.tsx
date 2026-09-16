import React from 'react';
import HomeClient from '@/components/home/HomeClient';
import { 
  getProducts, 
  getManufacturers, 
  getCertifications, 
  getCompanyStats 
} from '@/lib/db';

export const revalidate = 0; // Dynamic data

export default async function HomePage() {
  const [products, manufacturers, certifications, stats] = await Promise.all([
    getProducts({ featuredOnly: false }),
    getManufacturers(),
    getCertifications(),
    getCompanyStats()
  ]);

  return (
    <HomeClient
      products={products}
      manufacturers={manufacturers}
      certifications={certifications}
      stats={stats}
    />
  );
}
