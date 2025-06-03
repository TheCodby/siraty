"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({
  content,
  className = "",
}: MarkdownRendererProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headers
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 mt-3 first:mt-0">
              {children}
            </h3>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="ml-2">{children}</li>,

          // Code blocks
          pre: ({ children }) => {
            // Simple text extraction for copying - just convert to string
            const codeContent = String(children).replace(/<[^>]*>/g, "");

            return (
              <div className="relative group mb-4">
                <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm border border-gray-200 dark:border-gray-700">
                  {children}
                </pre>
                <button
                  onClick={() => copyCode(codeContent)}
                  className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-600"
                  title="Copy code"
                >
                  {copiedCode === codeContent ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>
            );
          },

          // Inline code
          code: ({ children, className }) => {
            const isCodeBlock = className?.includes("language-");
            if (isCodeBlock) {
              return <code className={className}>{children}</code>;
            }
            return (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {children}
              </code>
            );
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
              <div className="text-gray-700 dark:text-gray-300 italic">
                {children}
              </div>
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              {children}
            </td>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            >
              {children}
            </a>
          ),

          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-white">
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-4 border-gray-200 dark:border-gray-700" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
