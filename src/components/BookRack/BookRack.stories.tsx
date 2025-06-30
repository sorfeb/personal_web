import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BookRack } from './BookRack';
import { VolumeProvider } from '../../context/VolumeContext';

// Sample Medium articles data matching your blog structure
const sampleArticles = [
  {
    title: 'Building Modern Web Applications with Next.js',
    link: 'https://medium.com/@soros21febriano/building-modern-web-applications',
    pubDate: '2024-01-15T10:00:00Z',
    contentSnippet: 'Learn how to build scalable web applications using Next.js framework with server-side rendering and static site generation.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop',
  },
  {
    title: 'The Future of JavaScript Development',
    link: 'https://medium.com/@soros21febriano/future-of-javascript',
    pubDate: '2024-02-20T14:30:00Z',
    contentSnippet: 'Exploring the latest trends and technologies shaping the future of JavaScript development ecosystem.',
    coverImage: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0c?w=400&h=600&fit=crop',
  },
  {
    title: 'Mastering React Hooks',
    link: 'https://medium.com/@soros21febriano/mastering-react-hooks',
    pubDate: '2024-03-10T09:15:00Z',
    contentSnippet: 'A comprehensive guide to understanding and effectively using React Hooks in your applications.',
    coverImage: null,
  },
  {
    title: 'TypeScript Best Practices',
    link: 'https://medium.com/@soros21febriano/typescript-best-practices',
    pubDate: '2024-03-25T16:45:00Z',
    contentSnippet: 'Essential TypeScript patterns and practices for building maintainable and type-safe applications.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop',
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use What',
    link: 'https://medium.com/@soros21febriano/css-grid-vs-flexbox',
    pubDate: '2024-04-05T11:20:00Z',
    contentSnippet: 'Understanding the differences between CSS Grid and Flexbox and when to use each layout system.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  },
  {
    title: 'Building Accessible Web Applications',
    link: 'https://medium.com/@soros21febriano/building-accessible-web-apps',
    pubDate: '2024-04-18T13:00:00Z',
    contentSnippet: 'Learn how to create inclusive web applications that work for everyone, including users with disabilities.',
    coverImage: null,
  },
];

const meta: Meta<typeof BookRack> = {
  title: 'Blog Components/BookRack',
  component: BookRack,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A skeumorphic wooden bookshelf component that displays Medium blog articles as books with realistic 3D effects, hover interactions, and sound feedback.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <VolumeProvider>
        <div style={{ padding: '20px', backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
          <Story />
        </div>
      </VolumeProvider>
    ),
  ],
  argTypes: {
    articles: {
      description: 'Array of Medium article objects to display as books',
      control: 'object',
    },
    showSearch: {
      description: 'Whether to show search functionality',
      control: 'boolean',
    },
    loading: {
      description: 'Loading state indicator',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default bookshelf with multiple articles displayed as books
 */
export const Default: Story = {
  args: {
    articles: sampleArticles,
    showSearch: true,
    loading: false,
  },
};

/**
 * Loading state while fetching articles
 */
export const Loading: Story = {
  args: {
    articles: [],
    showSearch: true,
    loading: true,
  },
};

/**
 * Bookshelf without search functionality
 */
export const NoSearch: Story = {
  args: {
    articles: sampleArticles,
    showSearch: false,
    loading: false,
  },
};

/**
 * Empty bookshelf state
 */
export const EmptyShelf: Story = {
  args: {
    articles: [],
    showSearch: true,
    loading: false,
  },
};

/**
 * Bookshelf with few articles
 */
export const FewArticles: Story = {
  args: {
    articles: sampleArticles.slice(0, 3),
    showSearch: true,
    loading: false,
  },
};

/**
 * Single article display
 */
export const SingleArticle: Story = {
  args: {
    articles: [sampleArticles[0]],
    showSearch: false,
    loading: false,
  },
};

/**
 * Single row bookshelf (1 row)
 */
export const OneRow: Story = {
  args: {
    articles: sampleArticles.slice(0, 6), // 6 books = 1 row at desktop
    showSearch: true,
    loading: false,
  },
};

/**
 * Two rows bookshelf (2 rows)
 */
export const TwoRows: Story = {
  args: {
    articles: sampleArticles.slice(0, 12).concat([
      {
        title: 'Advanced React Patterns',
        link: 'https://medium.com/@soros21febriano/advanced-react-patterns',
        pubDate: '2024-05-01T10:00:00Z',
        contentSnippet: 'Deep dive into advanced React patterns and architectural decisions for complex applications.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop',
      },
      {
        title: 'Modern CSS Techniques',
        link: 'https://medium.com/@soros21febriano/modern-css-techniques',
        pubDate: '2024-05-15T14:30:00Z',
        contentSnippet: 'Exploring the latest CSS features and techniques for modern web development.',
        coverImage: null,
      },
      {
        title: 'Node.js Performance Optimization',
        link: 'https://medium.com/@soros21febriano/nodejs-performance',
        pubDate: '2024-06-01T09:00:00Z',
        contentSnippet: 'Best practices for optimizing Node.js applications for production environments.',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=600&fit=crop',
      },
      {
        title: 'Web Security Fundamentals',
        link: 'https://medium.com/@soros21febriano/web-security',
        pubDate: '2024-06-15T16:00:00Z',
        contentSnippet: 'Essential security practices every web developer should know and implement.',
        coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop',
      },
      {
        title: 'GraphQL vs REST APIs',
        link: 'https://medium.com/@soros21febriano/graphql-vs-rest',
        pubDate: '2024-07-01T11:30:00Z',
        contentSnippet: 'Comprehensive comparison between GraphQL and REST API architectures.',
        coverImage: null,
      },
      {
        title: 'Docker for Frontend Developers',
        link: 'https://medium.com/@soros21febriano/docker-frontend',
        pubDate: '2024-07-15T13:45:00Z',
        contentSnippet: 'Getting started with Docker containerization for frontend development workflows.',
        coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=600&fit=crop',
      }
    ]).slice(0, 12), // 12 books = 2 rows at desktop
    showSearch: true,
    loading: false,
  },
};

/**
 * Three rows bookshelf (3 rows)
 */
export const ThreeRows: Story = {
  args: {
    articles: sampleArticles.concat([
      {
        title: 'Advanced React Patterns',
        link: 'https://medium.com/@soros21febriano/advanced-react-patterns',
        pubDate: '2024-05-01T10:00:00Z',
        contentSnippet: 'Deep dive into advanced React patterns and architectural decisions for complex applications.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop',
      },
      {
        title: 'Modern CSS Techniques',
        link: 'https://medium.com/@soros21febriano/modern-css-techniques',
        pubDate: '2024-05-15T14:30:00Z',
        contentSnippet: 'Exploring the latest CSS features and techniques for modern web development.',
        coverImage: null,
      },
      {
        title: 'Node.js Performance Optimization',
        link: 'https://medium.com/@soros21febriano/nodejs-performance',
        pubDate: '2024-06-01T09:00:00Z',
        contentSnippet: 'Best practices for optimizing Node.js applications for production environments.',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=600&fit=crop',
      },
      {
        title: 'Web Security Fundamentals',
        link: 'https://medium.com/@soros21febriano/web-security',
        pubDate: '2024-06-15T16:00:00Z',
        contentSnippet: 'Essential security practices every web developer should know and implement.',
        coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop',
      },
      {
        title: 'GraphQL vs REST APIs',
        link: 'https://medium.com/@soros21febriano/graphql-vs-rest',
        pubDate: '2024-07-01T11:30:00Z',
        contentSnippet: 'Comprehensive comparison between GraphQL and REST API architectures.',
        coverImage: null,
      },
      {
        title: 'Docker for Frontend Developers',
        link: 'https://medium.com/@soros21febriano/docker-frontend',
        pubDate: '2024-07-15T13:45:00Z',
        contentSnippet: 'Getting started with Docker containerization for frontend development workflows.',
        coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=600&fit=crop',
      },
      {
        title: 'Progressive Web Apps',
        link: 'https://medium.com/@soros21febriano/progressive-web-apps',
        pubDate: '2024-08-01T10:15:00Z',
        contentSnippet: 'Building PWAs that deliver native app experiences on the web.',
        coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop',
      },
      {
        title: 'State Management in React',
        link: 'https://medium.com/@soros21febriano/react-state-management',
        pubDate: '2024-08-15T14:20:00Z',
        contentSnippet: 'Comparing different state management solutions for React applications.',
        coverImage: null,
      },
      {
        title: 'Microservices Architecture',
        link: 'https://medium.com/@soros21febriano/microservices-architecture',
        pubDate: '2024-09-01T09:30:00Z',
        contentSnippet: 'Design patterns and best practices for building microservices architectures.',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=600&fit=crop',
      },
      {
        title: 'Testing Strategies for Modern Web Apps',
        link: 'https://medium.com/@soros21febriano/testing-strategies',
        pubDate: '2024-09-15T16:45:00Z',
        contentSnippet: 'Comprehensive testing approaches for reliable web application development.',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop',
      },
      {
        title: 'Cloud Deployment Best Practices',
        link: 'https://medium.com/@soros21febriano/cloud-deployment',
        pubDate: '2024-10-01T12:00:00Z',
        contentSnippet: 'Essential practices for deploying and scaling applications in the cloud.',
        coverImage: null,
      },
      {
        title: 'Web Performance Optimization',
        link: 'https://medium.com/@soros21febriano/web-performance',
        pubDate: '2024-10-15T15:30:00Z',
        contentSnippet: 'Techniques and tools for optimizing web application performance and user experience.',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop',
      }
    ]).slice(0, 18), // 18 books = 3 rows at desktop
    showSearch: true,
    loading: false,
  },
};

/**
 * Four rows bookshelf (4 rows) - Full library
 */
export const FourRows: Story = {
  args: {
    articles: sampleArticles.concat([
      {
        title: 'Advanced React Patterns',
        link: 'https://medium.com/@soros21febriano/advanced-react-patterns',
        pubDate: '2024-05-01T10:00:00Z',
        contentSnippet: 'Deep dive into advanced React patterns and architectural decisions for complex applications.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop',
      },
      {
        title: 'Modern CSS Techniques',
        link: 'https://medium.com/@soros21febriano/modern-css-techniques',
        pubDate: '2024-05-15T14:30:00Z',
        contentSnippet: 'Exploring the latest CSS features and techniques for modern web development.',
        coverImage: null,
      },
      {
        title: 'Node.js Performance Optimization',
        link: 'https://medium.com/@soros21febriano/nodejs-performance',
        pubDate: '2024-06-01T09:00:00Z',
        contentSnippet: 'Best practices for optimizing Node.js applications for production environments.',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=600&fit=crop',
      },
      {
        title: 'Web Security Fundamentals',
        link: 'https://medium.com/@soros21febriano/web-security',
        pubDate: '2024-06-15T16:00:00Z',
        contentSnippet: 'Essential security practices every web developer should know and implement.',
        coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop',
      },
      {
        title: 'GraphQL vs REST APIs',
        link: 'https://medium.com/@soros21febriano/graphql-vs-rest',
        pubDate: '2024-07-01T11:30:00Z',
        contentSnippet: 'Comprehensive comparison between GraphQL and REST API architectures.',
        coverImage: null,
      },
      {
        title: 'Docker for Frontend Developers',
        link: 'https://medium.com/@soros21febriano/docker-frontend',
        pubDate: '2024-07-15T13:45:00Z',
        contentSnippet: 'Getting started with Docker containerization for frontend development workflows.',
        coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=600&fit=crop',
      },
      {
        title: 'Progressive Web Apps',
        link: 'https://medium.com/@soros21febriano/progressive-web-apps',
        pubDate: '2024-08-01T10:15:00Z',
        contentSnippet: 'Building PWAs that deliver native app experiences on the web.',
        coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop',
      },
      {
        title: 'State Management in React',
        link: 'https://medium.com/@soros21febriano/react-state-management',
        pubDate: '2024-08-15T14:20:00Z',
        contentSnippet: 'Comparing different state management solutions for React applications.',
        coverImage: null,
      },
      {
        title: 'Microservices Architecture',
        link: 'https://medium.com/@soros21febriano/microservices-architecture',
        pubDate: '2024-09-01T09:30:00Z',
        contentSnippet: 'Design patterns and best practices for building microservices architectures.',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=600&fit=crop',
      },
      {
        title: 'Testing Strategies for Modern Web Apps',
        link: 'https://medium.com/@soros21febriano/testing-strategies',
        pubDate: '2024-09-15T16:45:00Z',
        contentSnippet: 'Comprehensive testing approaches for reliable web application development.',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop',
      },
      {
        title: 'Cloud Deployment Best Practices',
        link: 'https://medium.com/@soros21febriano/cloud-deployment',
        pubDate: '2024-10-01T12:00:00Z',
        contentSnippet: 'Essential practices for deploying and scaling applications in the cloud.',
        coverImage: null,
      },
      {
        title: 'Web Performance Optimization',
        link: 'https://medium.com/@soros21febriano/web-performance',
        pubDate: '2024-10-15T15:30:00Z',
        contentSnippet: 'Techniques and tools for optimizing web application performance and user experience.',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop',
      },
      {
        title: 'Machine Learning for Web Developers',
        link: 'https://medium.com/@soros21febriano/ml-for-web-devs',
        pubDate: '2024-11-01T10:00:00Z',
        contentSnippet: 'Introduction to machine learning concepts and tools for web developers.',
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop',
      },
      {
        title: 'Blockchain Development Basics',
        link: 'https://medium.com/@soros21febriano/blockchain-basics',
        pubDate: '2024-11-15T14:30:00Z',
        contentSnippet: 'Getting started with blockchain development and smart contracts.',
        coverImage: null,
      },
      {
        title: 'Design Systems at Scale',
        link: 'https://medium.com/@soros21febriano/design-systems',
        pubDate: '2024-12-01T11:00:00Z',
        contentSnippet: 'Building and maintaining design systems for large-scale applications.',
        coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=600&fit=crop',
      },
      {
        title: 'Future of Web Development',
        link: 'https://medium.com/@soros21febriano/future-web-dev',
        pubDate: '2024-12-15T16:00:00Z',
        contentSnippet: 'Emerging trends and technologies shaping the future of web development.',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
      },
      {
        title: 'API Design Principles',
        link: 'https://medium.com/@soros21febriano/api-design',
        pubDate: '2025-01-01T09:00:00Z',
        contentSnippet: 'Essential principles for designing robust and developer-friendly APIs.',
        coverImage: null,
      },
      {
        title: 'Mobile-First Development',
        link: 'https://medium.com/@soros21febriano/mobile-first',
        pubDate: '2025-01-15T13:30:00Z',
        contentSnippet: 'Strategies for building mobile-first responsive web applications.',
        coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop',
      }
    ]).slice(0, 24), // 24 books = 4 rows at desktop
    showSearch: true,
    loading: false,
  },
};