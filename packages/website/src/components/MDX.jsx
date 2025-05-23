import { lazy, Suspense, useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import docs from '../data/docs';
import { Highlight, themes } from 'prism-react-renderer';
import api from '../data/api';
import Sandpack, { SandpackWithQuillTemplate, SandpackWithReact } from './Sandpack';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from './Heading';
import Hint from './Hint';
import SEO from './SEO';
import Link from './Link';
import Editor from './Editor';
import Callout from './Callout';

const components = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  a: Link,
  Sandpack,
  SandpackWithQuillTemplate,
  SandpackWithReact,
  Hint,
  Editor,
  Callout,
  pre: ({ children }) => {
    const className = children.props.className || '';
    const matches = className.match(/language-(?<lang>.*)/);
    return (
      <Highlight
        code={children.props.children}
        theme={{
          ...themes.vsDark,
          // plain: {
          //   ...themes.oneLight.plain,
          //   background: 'transparent',
          // },
        }}
        language={
          matches && matches.groups && matches.groups.lang
            ? matches.groups.lang
            : ''
        }
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, i) =>
                i === tokens.length - 1 &&
                line[0].empty &&
                line.length === 1 ? null : (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => {
                      const { myKey, ...rest } = getTokenProps({ token, key });
                      return (
                        <span key={myKey} {...rest} />
                      );
                    })}
                  </div>
                ),
              )}
            </code>
          </pre>
        )}
      </Highlight>
    );
  },
};

export default function MDX({ mdxSource, data }) {
  return (
    <>
      <SEO title={mdxSource.frontmatter.title} />
      <MDXRemote
        {...mdxSource}
        components={components}
        scope={{ data: { api, docs }, scope: data }}
      />
    </>
  );
}
