'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import type { RichTextContent } from '@/types';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── Styles ───────────────────────────────────────────────────────────────────

const proseStyles: SxProps<Theme> = {
  '& p': {
    fontSize: '1.0625rem',
    lineHeight: 1.75,
    color: 'text.primary',
    mb: 3,
  },
  '& h2': {
    fontSize: { xs: '1.5rem', md: '1.75rem' },
    fontWeight: 700,
    letterSpacing: '-0.015em',
    lineHeight: 1.3,
    mt: 6,
    mb: 2,
    color: 'text.primary',
  },
  '& h3': {
    fontSize: { xs: '1.25rem', md: '1.375rem' },
    fontWeight: 600,
    lineHeight: 1.4,
    mt: 5,
    mb: 1.5,
    color: 'text.primary',
  },
  '& h4': {
    fontSize: '1.125rem',
    fontWeight: 600,
    mt: 4,
    mb: 1,
    color: 'text.primary',
  },
  '& ul, & ol': {
    pl: 3,
    mb: 3,
    '& li': {
      fontSize: '1.0625rem',
      lineHeight: 1.75,
      mb: 1,
      color: 'text.primary',
    },
  },
  '& blockquote': {
    borderLeft: '3px solid',
    borderColor: 'primary.main',
    pl: 3,
    ml: 0,
    my: 4,
    '& p': { color: 'text.secondary', fontStyle: 'italic', mb: 0 },
  },
  '& pre': {
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1.5,
    p: 3,
    mb: 3,
    overflowX: 'auto',
    '& code': {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '0.875rem',
      bgcolor: 'transparent',
      p: 0,
    },
  },
  '& code': {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '0.875em',
    bgcolor: 'action.hover',
    px: 0.75,
    py: 0.25,
    borderRadius: 0.5,
  },
  '& a': {
    color: 'primary.main',
    textDecorationLine: 'underline',
    textUnderlineOffset: '3px',
    '&:hover': { color: 'primary.dark' },
  },
  '& img': {
    maxWidth: '100%',
    borderRadius: 1.5,
    my: 3,
  },
  '& hr': {
    my: 5,
    borderColor: 'divider',
  },
};

// ─── Node Renderers ───────────────────────────────────────────────────────────

function renderInline(node: RichTextContent[number], idx: number): React.ReactNode {
  if (node.text !== undefined) {
    let el: React.ReactNode = node.text;
    if (node.bold)          el = <strong key={idx}>{el}</strong>;
    if (node.italic)        el = <em key={idx}>{el}</em>;
    if (node.underline)     el = <u key={idx}>{el}</u>;
    if (node.strikethrough) el = <s key={idx}>{el}</s>;
    if (node.code)          el = <code key={idx}>{el}</code>;
    return el;
  }
  if (node.type === 'link' && node.url) {
    return (
      <a key={idx} href={node.url} target="_blank" rel="noopener noreferrer">
        {node.children?.map((c, i) => renderInline(c, i))}
      </a>
    );
  }
  return null;
}

function renderNode(node: RichTextContent[number], idx: number): React.ReactNode {
  const children = node.children?.map((c, i) => renderInline(c, i));

  switch (node.type) {
    case 'paragraph':
      return <p key={idx}>{children}</p>;
    case 'heading': {
      const Tag = `h${node.level ?? 2}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <Tag key={idx}>{children}</Tag>;
    }
    case 'list':
      return node.format === 'ordered'
        ? <ol key={idx}>{node.children?.map((c, i) => renderNode(c, i))}</ol>
        : <ul key={idx}>{node.children?.map((c, i) => renderNode(c, i))}</ul>;
    case 'list-item':
      return <li key={idx}>{children}</li>;
    case 'quote':
      return <blockquote key={idx}><p>{children}</p></blockquote>;
    case 'code':
      return <pre key={idx}><code>{children}</code></pre>;
    case 'image':
      return node.image
        ? <img key={idx} src={node.image.url} alt={node.image.alternativeText ?? ''} width={node.image.width} height={node.image.height} />
        : null;
    case 'divider':
      return <hr key={idx} />;
    default:
      return children ? <p key={idx}>{children}</p> : null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface RichTextRendererProps {
  content: RichTextContent;
}

/**
 * RichTextRenderer — Strapi Blocks 富文本渲染器
 *
 * 将 Strapi Blocks JSON 渲染为 HTML 元素，样式通过 MUI sx 系统注入。
 * 纯客户端渲染，避免 hydration 问题。
 *
 * @example
 * <RichTextRenderer content={blog.content} />
 */
export function RichTextRenderer({ content }: RichTextRendererProps) {
  return (
    <Box sx={proseStyles}>
      {content.map((node, idx) => renderNode(node, idx))}
    </Box>
  );
}
