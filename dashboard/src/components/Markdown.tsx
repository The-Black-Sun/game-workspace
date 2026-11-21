import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

/** 只渲染本地工作区文档；html:false 保证原始 HTML 不执行（与工作区规则一致） */
export function Markdown({ text, className = '' }: { text: string; className?: string }) {
  const html = useMemo(() => md.render(text), [text]);
  return (
    <div
      className={`md-body ${className}`}
      // markdown-it 在 html:false 下输出已转义，无脚本风险
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
