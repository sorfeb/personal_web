/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.sorosfebria.co',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  outDir: 'public',
  exclude: [
    '/api/*',
    '/404',
    // Visitor-authored content; the page is noindex, so keep it out of the
    // sitemap too rather than advertising it for daily crawls.
    '/chatroom',
  ],
  additionalPaths: async (config) => {
    return [
      { loc: '/about', priority: 0.8, changefreq: 'monthly' },
      { loc: '/profile', priority: 0.8, changefreq: 'monthly' },
      { loc: '/projects', priority: 0.7, changefreq: 'monthly' },
      { loc: '/photos', priority: 0.7, changefreq: 'monthly' },
      { loc: '/media', priority: 0.7, changefreq: 'monthly' },
      { loc: '/blog', priority: 0.7, changefreq: 'weekly' },
      { loc: '/llms.txt', priority: 0.3, changefreq: 'monthly' },
    ]
  },
}