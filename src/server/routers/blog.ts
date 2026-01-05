import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import Parser from 'rss-parser';

const parser = new Parser();

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
          link: item.link,
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
