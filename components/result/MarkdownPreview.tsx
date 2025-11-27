import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getKeywordContext } from '../../utils';
import { keywordToSlug } from '../../utils';

interface MarkdownPreviewProps {
  content: string;
  jobDescription?: string;
  highlightKeywords?: boolean;
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ content, jobDescription, highlightKeywords = false }, ref) => {
    const baseComponents = {
      h1: ({ node, ...props }: any) => (
        <h1 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-slate-100" {...props} />
      ),
      h2: ({ node, ...props }: any) => (
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 flex items-center" {...props} />
      ),
      h3: ({ node, ...props }: any) => (
        <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2" {...props} />
      ),
      p: ({ node, ...props }: any) => (
        <p className="text-slate-600 leading-relaxed mb-4 text-sm font-normal" {...props} />
      ),
      ul: ({ node, ...props }: any) => (
        <ul className="list-disc list-outside ml-4 space-y-2 mb-4 text-slate-600" {...props} />
      ),
      li: ({ node, ...props }: any) => (
        <li className="pl-1 text-sm leading-relaxed font-normal" {...props} />
      ),
      strong: ({ node, ...props }: any) => (
        <strong className="font-bold text-slate-900" {...props} />
      ),
      hr: ({ node, ...props }: any) => (
        <hr className="my-6 border-slate-200" {...props} />
      ),
    };

    const keywordCodeComponent = {
      code: ({ node, ...props }: any) => {
        const keyword = String(props.children);
        const slug = keywordToSlug(keyword);
        const context = getKeywordContext(keyword, jobDescription || '');
        
        return (
          <span 
            id={`keyword-${slug}`}
            className="group relative cursor-help inline-block transition-colors duration-500 rounded-sm"
          >
            <span className="border-b border-dashed border-slate-300 hover:bg-yellow-50 transition-colors duration-200">
              {keyword}
            </span>
            <span 
              data-tooltip="true" 
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none text-center leading-snug select-none"
            >
              <span className="block text-indigo-300 font-bold mb-1 text-[10px] uppercase tracking-wider">
                Original Context
              </span>
              "{context}"
              <svg 
                className="absolute text-slate-800 h-2 w-4 left-1/2 -translate-x-1/2 top-full block" 
                viewBox="0 0 255 255"
              >
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
              </svg>
            </span>
          </span>
        );
      }
    };

    const components = highlightKeywords 
      ? { ...baseComponents, ...keywordCodeComponent }
      : baseComponents;

    return (
      <div ref={ref} className="prose prose-slate prose-sm max-w-none text-slate-700">
        <ReactMarkdown components={components}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }
);

MarkdownPreview.displayName = 'MarkdownPreview';

