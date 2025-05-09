const { version, homepage } = require('./package.json');

const cdn = process.env.NEXT_PUBLIC_LOCAL_QUILL
  ? `http://localhost:${process.env.npm_package_config_ports_webpack}`
  : `https://cdn.jsdelivr.net/npm/quill@${version}/dist`;

module.exports = {
  version,
  cdn,
  github: 'https://github.com/slab/quill/tree/main/packages/website/',
  highlightjs: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0',
  katex: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist',
  url: homepage,
  title: 'Quill Next - Your powerful and extensible rich text editor',
  shortTitle: 'Quill Next Editor',
  description:
    'Quill Next is a free, open source rich text editor built for the modern web. Completely customize it for any need with its modular architecture and expressive API.',
  shortDescription:
    'Quill Next is a free, open source rich text editor built for the modern web.',
};
