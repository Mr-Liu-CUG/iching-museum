"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/use-translation";
import MarkdownRenderer from "./MarkdownRenderer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const EXAMPLE_PROMPTS = [
  "我该如何面对当前的困境？",
  "如何理解「潜龙勿用」？",
  "人生到了一个十字路口，怎么选择？",
  "易经如何看待财富和成功？",
];

const QUICK_CHIPS = ["职场困惑", "情感关系", "人生方向", "财富认知", "情绪管理"];

export default function AITutorEntry() {
  const { t } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setChatStarted(true);
      setStreaming(true);
      setStreamingContent("");

      try {
        const apiMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          let errMsg = `HTTP ${response.status}`;
          try {
            const err = await response.json();
            errMsg = err.error || err.detail || errMsg;
          } catch {
            errMsg = await response.text().catch(() => errMsg);
          }
          setStreamingContent(`抱歉，AI 导师暂时无法回应：${errMsg}`);
          setStreaming(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          setStreamingContent("无法读取响应流。");
          setStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingContent(fullContent);
              }
            } catch {
              // skip
            }
          }
        }

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: fullContent,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setStreamingContent("");
      } catch (e) {
        console.error("AI Tutor error:", e);
        setStreamingContent(`网络连接失败：${e instanceof Error ? e.message : "请检查网络后重试"}`);
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setChatStarted(false);
    setStreamingContent("");
    setStreaming(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <motion.section
      id="ai-tutor"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 px-4"
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-song text-lg tracking-[4px] text-ink-dark mb-2">
            {t("aiTutor.title")}
          </h2>
          <p className="font-sans text-xs tracking-[2px] text-ink-muted">
            {t("aiTutor.subtitle")}
          </p>
        </div>

        <div className="rounded-lg border border-border-gold bg-card-bg-solid overflow-hidden transition-all duration-300">
          {/* Chat area */}
          <div
            className={`transition-all duration-300 ${
              chatStarted ? "h-[420px] overflow-y-auto" : ""
            }`}
          >
            <AnimatePresence>
              {!chatStarted ? (
                <motion.div
                  key="welcome"
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pt-5 pb-4 text-center"
                >
                  <p className="font-song text-sm text-ink-muted mb-4">
                    有什么人生困惑想聊聊？
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                    {QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => sendMessage(`关于${chip}，我有些困惑想请教。`)}
                        className="px-2.5 py-1 rounded-full border border-border-gold/50 bg-bg-paper/60 font-sans text-[10px] text-ink-muted hover:text-gold-primary hover:border-gold-primary/30 transition-colors cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {EXAMPLE_PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => sendMessage(p)}
                        className="block w-full text-left px-3 py-2 rounded border border-border-gold/30 bg-bg-paper/40 font-song text-xs text-ink-muted hover:text-gold-primary hover:border-gold-primary/25 transition-colors cursor-pointer"
                      >
                        「{p}」
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-4 space-y-4"
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gold-primary/10 border border-gold-primary/20 text-ink-dark"
                            : "bg-bg-paper border border-border-gold/50 text-ink-dark"
                        }`}
                      >
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    </motion.div>
                  ))}

                  {/* Streaming message */}
                  {streamingContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm bg-bg-paper border border-border-gold/50">
                        <MarkdownRenderer content={streamingContent} isStreaming />
                      </div>
                    </motion.div>
                  )}

                  <div ref={chatEndRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="border-t border-border-pale/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("aiTutor.placeholder")}
                disabled={streaming}
                className="flex-1 px-3 py-2 rounded-md border border-border-gold bg-bg-paper font-song text-[13px] text-ink-dark placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-primary/50 transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={streaming || !input.trim()}
                className="shrink-0 px-4 py-2 rounded-md bg-gold-primary/15 text-gold-primary border border-gold-primary/30 font-song text-[13px] hover:bg-gold-primary/25 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {streaming ? "..." : t("aiTutor.startChat")}
              </button>
            </div>

            {chatStarted && (
              <button
                type="button"
                onClick={resetChat}
                className="mt-2 font-sans text-[10px] text-ink-muted/50 hover:text-ink-muted transition-colors cursor-pointer"
              >
                重新开始对话
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center font-song text-[10px] text-ink-muted/60 leading-relaxed mt-4">
          {t("aiTutor.disclaimer")}
        </p>
      </div>
    </motion.section>
  );
}
