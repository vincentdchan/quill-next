const items = [
  {
    title: 'Quickstart',
    url: '/docs/quickstart',
  },
  {
    title: 'Why Quill Next',
    url: '/docs/why-quill-next',
  },
  {
    title: 'Installation',
    url: '/docs/installation',
  },
  {
    title: 'Configuration',
    url: '/docs/configuration',
  },
  {
    title: 'Plugins',
    url: '/docs/plugins/plugins',
    children: [
      {
        title: 'Builtin Plugins',
        url: '/docs/plugins/builtin-plugins',
      },
    ],
  },
  {
    title: 'Hooks',
    url: '/docs/hooks',
  },
  {
    title: 'Formats',
    url: '/docs/formats',
  },
  {
    title: 'API',
    url: '/docs/api',
    children: [
      {
        title: 'Content',
        url: '/docs/api/#content',
      },
      {
        title: 'Formatting',
        url: '/docs/api/#formatting',
      },
      {
        title: 'Selection',
        url: '/docs/api/#selection',
      },
      {
        title: 'Editor',
        url: '/docs/api/#editor',
      },
      {
        title: 'Events',
        url: '/docs/api/#events',
      },
      {
        title: 'Model',
        url: '/docs/api/#model',
      },
      {
        title: 'Extension',
        url: '/docs/api/#extension',
      },
    ],
  },
  {
    title: 'Delta',
    url: '/docs/delta',
  },
  {
    title: 'Modules',
    url: '/docs/modules',
    children: [
      {
        title: 'Legacy Toolbar',
        url: '/docs/modules/legacy-toolbar',
      },
      {
        title: 'Keyboard',
        url: '/docs/modules/keyboard',
      },
      {
        title: 'History',
        url: '/docs/modules/history',
      },
      {
        title: 'Clipboard',
        url: '/docs/modules/clipboard',
      },
      {
        title: 'Syntax',
        url: '/docs/modules/syntax',
      },
    ],
  },
  {
    title: 'Customization',
    url: '/docs/customization',
    children: [
      {
        title: 'Themes',
        url: '/docs/customization/themes',
      },
      {
        title: 'Registries',
        url: '/docs/customization/registries',
      },
    ],
  },
  {
    title: 'Guides',
    url: '/docs/guides/designing-the-delta-format',
    children: [
      {
        title: 'Designing the Delta Format',
        url: '/docs/guides/designing-the-delta-format',
      },
      {
        title: 'Building a Custom Module',
        url: '/docs/guides/building-a-custom-module',
      },
      {
        title: 'Cloning Medium with Parchment',
        url: '/docs/guides/cloning-medium-with-parchment',
      },
    ],
  },
];

export default items;
