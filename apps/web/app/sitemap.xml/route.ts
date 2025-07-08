import { getServerSideSitemap } from 'next-sitemap';

import { createCmsClient } from '@kit/cms';

import appConfig from '~/config/app.config';

/**
 * @description The maximum age of the sitemap in seconds.
 * This is used to set the cache-control header for the sitemap. The cache-control header is used to control how long the sitemap is cached.
 * By default, the cache-control header is set to 'public, max-age=600, s-maxage=3600'.
 * This means that the sitemap will be cached for 600 seconds (10 minutes) and will be considered stale after 3600 seconds (1 hour).
 */
const MAX_AGE = 60;
const S_MAX_AGE = 3600;

export async function GET() {
  try {
    const paths = getPaths();
    const contentItems = await getContentItems();

    const headers = {
      'Cache-Control': `public, max-age=${MAX_AGE}, s-maxage=${S_MAX_AGE}`,
    };

    return getServerSideSitemap([...paths, ...contentItems], headers);
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    // Return a minimal valid sitemap so build never fails
    return new Response(
      `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': `public, max-age=${MAX_AGE}, s-maxage=${S_MAX_AGE}`,
        },
      }
    );
  }
}

function getPaths() {
  const paths = [
    '/',
    '/faq',
    '/blog',
    '/docs',
    '/pricing',
    '/contact',
    '/cookie-policy',
    '/terms-of-service',
    '/privacy-policy',
    // add more paths here
  ];

  return paths.map((path) => {
    return {
      loc: new URL(path, appConfig.url).href,
      lastmod: new Date().toISOString(),
    };
  });
}

async function getContentItems() {
  try {
    const client = await createCmsClient();
    const limit = Infinity;

    const postsPromise = client
      .getContentItems({
        collection: 'posts',
        content: false,
        limit,
      })
      .then((response) => response.items)
      .then((posts) =>
        posts.map((post) => ({
          loc: new URL(`/blog/${post.slug}`, appConfig.url).href,
          lastmod: post.publishedAt
            ? new Date(post.publishedAt).toISOString()
            : new Date().toISOString(),
        })),
      );

    const docsPromise = client
      .getContentItems({
        collection: 'documentation',
        content: false,
        limit,
      })
      .then((response) => response.items)
      .then((docs) =>
        docs.map((doc) => ({
          loc: new URL(`/docs/${doc.slug}`, appConfig.url).href,
          lastmod: doc.publishedAt
            ? new Date(doc.publishedAt).toISOString()
            : new Date().toISOString(),
        })),
      );

    const [posts, docs] = await Promise.all([postsPromise, docsPromise]);

    return [...posts, ...docs];
  } catch (error) {
    console.error('Failed to fetch content items for sitemap:', error);

    return [];
  }
}
