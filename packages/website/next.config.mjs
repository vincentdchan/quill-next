import withMDX from '@next/mdx';
import env from './env.js';

/** @type {import('next').NextConfig} */
export default withMDX()({
  images: {
    unoptimized: true,
  },
  env: env,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  redirects: () => [
    {
      source: '/guides/upgrading-to-2-0',
      destination: '/docs/upgrading-to-2-0',
      permanent: true,
    },
    {
      source: '/guides/why-quill-next',
      destination: '/docs/why-quill-next',
      permanent: true,
    },
    {
      source: '/guides/how-to-customize-quill',
      destination: '/docs/customization',
      permanent: true,
    },
    {
      source: '/guides/building-a-custom-module',
      destination: '/docs/guides/building-a-custom-module',
      permanent: true,
    },
    {
      source: '/guides/cloning-medium-with-parchment',
      destination: '/docs/guides/cloning-medium-with-parchment',
      permanent: true,
    },
    {
      source: '/guides/designing-the-delta-format',
      destination: '/docs/guides/designing-the-delta-format',
      permanent: true,
    },
    {
      source: '/docs/registries',
      destination: '/docs/customization/registries',
      permanent: true,
    },
    {
      source: '/docs/themes',
      destination: '/docs/customization/themes',
      permanent: true,
    },
  ],
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [{ name: 'preset-default' }],
              },
            },
          },
        ],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
});
