"use client";

import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";

type TMessage = {
  idx: number;
  role: "system" | "user" | "assistant";
  content: string;
};

type TSystemMessage = Omit<TMessage, "idx">;

type TChatContext = {
  systemMessage: TSystemMessage;
  messages: TMessage[];
  updateSystemMessage: (content: string) => void;
  addMessage: (content: TMessage["content"], role: TMessage["role"]) => void;
  updateMessageContent: (idx: number, content: string) => void;
  removeMessage: (idx: number) => void;
  toggleMessageRole: (id: number) => void;
  submit: () => void;
  loading: boolean;
  error: string;
};

const defaultContext: TChatContext = {
  systemMessage: {
    role: "system",
    content:
      "- TSAI-LM is a helpful and harmless open-source AI language model developed by TSAI.\n- TSAI-LM is excited to be able to help the user, but will refuse to do anything that could be considered harmful to the user.\n- TSAI-LM is more than just an information source, TSAI-LM is also able to write poetry, short stories, and make jokes.\n- TSAI-LM will refuse to participate in anything that could harm a human.",
  },
  messages: [],
  updateSystemMessage: (content: string) => { },
  addMessage: (content, role) => { },
  updateMessageContent: (idx: number, content: string) => { },
  removeMessage: (idx: number) => { },
  toggleMessageRole: (idx: number) => { },
  submit: () => { },
  loading: true,
  error: "",
};

const ChatContext = React.createContext<TChatContext>(defaultContext);

export default function ChatProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [systemMessage, setSystemMessage] = useState(
    defaultContext.systemMessage
  );
  const [messages, setMessages] = useState<TMessage[]>([]);

  const updateSystemMessage = (content: string) => {
    setSystemMessage({
      role: "system",
      content,
    });
  };

  const removeMessage = (idx: number) => {
    setMessages((prev) => {
      const filtered = prev.filter((message) => message.idx !== idx);
      return filtered.map((message, index) => ({ ...message, idx: index }));
    });
  };

  const toggleMessageRole = (idx: number) => {
    setMessages((prev) => {
      const index = prev.findIndex((message) => message.idx === idx);
      if (index === -1) return prev;
      const message = prev[index];
      return [
        ...prev.slice(0, index),
        {
          ...message,
          role: message.role === "user" ? "assistant" : "user",
        },
        ...prev.slice(index + 1),
      ];
    });
  };

  const updateMessageContent = (idx: number, content: string) => {
    setMessages((prev) => {
      const index = prev.findIndex((message) => message.idx === idx);
      if (index === -1) return prev;
      const message = prev[index];
      return [
        ...prev.slice(0, index),
        {
          ...message,
          content,
        },
        ...prev.slice(index + 1),
      ];
    });
  };

  const submit = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const decoder = new TextDecoder();

      const messagesPayload = [systemMessage, ...messages].map(
        ({ role, content }) => ({
          role,
          content,
        })
      );
      const { body, ok } = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesPayload,
        }),
      });

      if (!body) return;
      const reader = body.getReader();

      if (!ok) {
        // Get the error message from the response body
        const { value } = await reader.read();
        const chunkValue = decoder.decode(value);
        const { error } = JSON.parse(chunkValue);

        throw new Error(
          error?.message ||
          "Failed to fetch response, check your connection and try again."
        );
      }

      let done = false;

      const message = {
        idx: messages.length,
        role: "assistant",
        content: "",
      } as TMessage;

      setMessages((prev) => {
        message.idx = prev.length;
        return [...prev, message];
      });

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        message.content += chunkValue;

        // Remove special tokens
        const cleanedContent = message.content
          .replace("<|ASSISTANT|>", "")
          .replace("<|SYSTEM|>", "")
          .replace("<|USER|>", "")
          .replace("<|endoftext|>", "");
        message.content = cleanedContent;

        updateMessageContent(message.idx as number, message.content);
      }
    } catch (error: any) {
      console.error(error);
    }

    setLoading(false);
  }, [loading, messages]);

  const addMessage = (
    content: string = "",
    role: TMessage["role"] = "user"
  ) => {
    setMessages((prev) => {
      const messages = [
        ...prev,
        {
          idx: prev.length,
          role,
          content: content || "",
        },
      ];
      return messages;
    });
  };

  const value = useMemo(
    () => ({
      systemMessage,
      messages,
      updateSystemMessage,
      addMessage,
      updateMessageContent,
      removeMessage,
      toggleMessageRole,
      submit,
      loading,
      error,
    }),
    [systemMessage, messages, loading, error, addMessage, submit]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export type { TMessage };

export const useChat = () => React.useContext(ChatContext);
