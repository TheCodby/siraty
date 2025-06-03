"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useChat } from "@/features/ai-chat/hooks/useChat";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import type { CVData } from "@/types/cv";
import {
  Send,
  Sparkles,
  MessageCircle,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Lightbulb,
  Zap,
} from "lucide-react";

interface ChatInterfaceProps {
  cvData?: CVData;
  language?: "en" | "ar";
  className?: string;
}

export const ChatInterface = ({
  cvData,
  language = "en",
  className = "",
}: ChatInterfaceProps) => {
  const t = useTranslations("ai.chat");
  const tCommon = useTranslations("ai.common");
  const [input, setInput] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    cvData,
    language,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const exampleQuestions = t.raw("examples.items") as string[];

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={clearMessages}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          title={t("clearChat")}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-6">
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("emptyState.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("emptyState.subtitle")}
              </p>
            </div>

            {/* Example Questions */}
            <div className="text-left max-w-md mx-auto">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {t("examples.title")}
              </h4>
              <div className="space-y-2">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="w-full text-left p-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  >
                    &ldquo;{question}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("welcome")}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`flex-1 max-w-[80%] ${
                message.role === "user" ? "max-w-[70%]" : ""
              }`}
            >
              <div
                className={`p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {message.role === "assistant" ? (
                  <MarkdownRenderer
                    content={message.content}
                    className="text-gray-700 dark:text-gray-300"
                  />
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                )}

                {message.role === "assistant" && (
                  <button
                    onClick={() => copyMessage(message.content, message.id)}
                    className="mt-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title={tCommon("copy")}
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Thinking Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">{t("thinking")}</span>
                  <div className="flex gap-1">
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-b-xl">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholder")}
              rows={1}
              className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none min-h-[48px] max-h-32"
              style={{ direction: language === "ar" ? "rtl" : "ltr" }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t("sendButton")}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
