"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
  isStreaming?: boolean;
}

export default function MarkdownRenderer({ content, isStreaming }: Props) {
  return (
    <div className="prose prose-sm max-w-none font-song text-[13px] leading-relaxed text-ink-dark
      prose-headings:font-song prose-headings:text-ink-dark prose-headings:font-medium
      prose-h1:text-base prose-h1:tracking-[2px] prose-h1:mt-3 prose-h1:mb-2
      prose-h2:text-[15px] prose-h2:tracking-[2px] prose-h2:text-gold-primary prose-h2:mt-4 prose-h2:mb-2 prose-h2:pb-1 prose-h2:border-b prose-h2:border-border-gold/30
      prose-h3:text-sm prose-h3:tracking-[1px] prose-h3:text-ink-dark prose-h3:mt-3 prose-h3:mb-1.5
      prose-h4:text-[13px] prose-h4:mt-2 prose-h4:mb-1
      prose-p:my-1.5 prose-p:leading-relaxed
      prose-strong:text-ink-dark prose-strong:font-semibold
      prose-em:text-ink-muted
      prose-ul:my-1.5 prose-ul:pl-4 prose-li:my-0.5 prose-li:marker:text-gold-primary/60
      prose-ol:my-1.5 prose-ol:pl-4
      prose-blockquote:border-l-2 prose-blockquote:border-gold-primary/40 prose-blockquote:bg-gold-pale/5 prose-blockquote:pl-3 prose-blockquote:pr-2 prose-blockquote:py-1 prose-blockquote:my-2 prose-blockquote:not-italic prose-blockquote:text-ink-muted
      prose-code:bg-bg-paper prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[12px] prose-code:font-sans prose-code:text-ink-dark
      prose-hr:border-border-gold/30 prose-hr:my-3
      prose-table:text-[12px] prose-th:text-left prose-th:font-medium prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-1.5 h-4 bg-gold-primary/60 ml-0.5 animate-pulse align-middle" />
      )}
    </div>
  );
}
