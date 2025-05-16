import { css } from "@emotion/react";

export const notionToolbarContainer = css({
  display: 'inline-flex',
  alignItems: 'stretch',
  height: '36px',
  background: 'white',
  overflow: 'hidden',
  fontSize: '14px',
  lineHeight: '1.2',
  borderRadius: '8px',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px',
  pointerEvents: 'auto',
  padding: '4px',
  boxSizing: 'border-box',
  isolation: 'isolate'
});

export const notionLinkButton = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',

  "& > svg": {
    width: '16px',
    height: '16px',
  },
});
