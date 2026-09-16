import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://junohealthcare.in';
  let products: any[] = [];
  try {
    products = await getProducts();
  } catch {
    // If database is unconfigured during build time, generate static routes
    products = [];
  }

  const productUrls = products.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  const staticUrls = [
    '',
    '/about',
    '/products',
    '/quality',
    '/manufacturing',
    '/certifications',
    '/company',
    '/contact',
    '/privacy',
    '/terms'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  return [...staticUrls, ...productUrls];
}
