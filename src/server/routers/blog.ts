import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import Parser from 'rss-parser';

const parser = new Parser();

/**
 * Medium post IDs whose canonical copy lives on this site. The bookshelf
 * links to the local page instead of Medium.
 */
const LOCAL_ARTICLES: Record<string, string> = {
  ccd32fc7581c: '/blog/busy-at-work-empty-on-github',
};

const localLink = (link: string | undefined) => {
  const id = link?.split('?')[0].split('-').pop();
  return (id && LOCAL_ARTICLES[id]) ?? link;
};

/**
 * Blog router for fetching external blog content
 */
export const blogRouter = createTRPCRouter({
  /**
   * Fetch Medium RSS feed articles
   * @returns Array of blog articles with title, link, date, snippet, and cover image
   */
  getMediumFeed: publicProcedure.query(async () => {
    try {

      const feed = await parser.parseURL('https://medium.com/feed/@soros21febriano');
      
      const articles = feed.items.map((item) => {
        const content = item['content:encoded'] ?? '';
        const imageMatch = content.match(/<img[^>]+src="([^">]+)"/);
        const coverImage = imageMatch ? imageMatch[1] : null;

        return {
          title: item.title,
          link: localLink(item.link),
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet,
          coverImage,
        };
      });

      return articles;
    } catch (error) {
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch Medium RSS feed',
      });
    }
  }),
});
