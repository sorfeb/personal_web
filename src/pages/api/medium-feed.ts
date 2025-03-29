import { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

const parser = new Parser();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const feed = await parser.parseURL('https://medium.com/feed/@soros21febriano');
    const articles = feed.items.map((item) => {
      // Extract the first image from the content:encoded field
      const content = item['content:encoded'] || '';
      const imageMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const coverImage = imageMatch ? imageMatch[1] : null;

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet,
        coverImage, // Add the extracted image URL
      };
    });

    res.status(200).json(articles);
  } catch (error) {
    console.error('Failed to fetch Medium RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch Medium RSS feed' });
  }
}