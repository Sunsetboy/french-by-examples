import { MetadataRoute } from 'next';
import { getAllConnectorIds, getAllTestIds } from '@/lib/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yourusername.github.io/french-by-examples'; // Update with your actual URL

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/connectors`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tests`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Connector pages
  const connectorIds = getAllConnectorIds();
  const connectorPages = connectorIds.map((id) => ({
    url: `${baseUrl}/connectors/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Test pages
  const testIds = getAllTestIds();
  const testPages = testIds.map((id) => ({
    url: `${baseUrl}/tests/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...connectorPages, ...testPages];
}
