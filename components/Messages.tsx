"use client";

import { TMessage, useChat } from "@/context/ChatProvider";
import { MinusCircle, PlusCircle } from "lucide-react";
import React, { useState } from "react";

function Message({ message: { idx, role, content } }: { message: TMessage }) {
  const { updateMessageContent, removeMessage, toggleMessageRole } = useChat();

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleToggleRole = () => {
    if (idx === undefined) return;

    toggleMessageRole(idx);
  };

  const handleRemove = () => {
    if (idx === undefined) return;

    removeMessage(idx);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === content || idx === undefined) return;

    updateMessageContent(idx, e.target.value);

    if (textAreaRef.current) {
      textAreaRef.current.style.height = "40px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    const resize = () => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "40px";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
    };

    resize();

    // Handle the 300ms delay on showing the conversation
    const timeout = setTimeout(() => {
      resize();
    }, 300);
  }, [content]);

  return (
    <div className="group flex cursor-pointer flex-row items-center border-b border-gray-300 p-4 transition-all hover:bg-gray-100">
      <div className="basis-3/12">
        <button
          className="select-none rounded p-2 text-sm font-semibold text-gray-700 transition-all group-hover:bg-gray-100"
          onClick={handleToggleRole}
        >
          {role.toUpperCase()}
        </button>
      </div>

      <div className="basis-8/12 items-center">
        <textarea
          ref={textAreaRef}
          className="text-md w-full resize-none rounded bg-transparent p-4 text-gray-700 focus:border-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          value={content}
          onChange={handleContentChange}
          placeholder={`Enter ${role} message here`}
        />
      </div>

      <div className="flex basis-1/12 justify-center">
        <button
          className={`group-hover:text-gray-300 text-transparent transition-all focus:outline-none hover:text-gray-700`}
          onClick={handleRemove}
        >
          <MinusCircle size={24} />
        </button>
      </div>
    </div>
  );
}

function AddMessage() {
  const { addMessage } = useChat();

  return (
    <button
      className="flex cursor-pointer flex-row gap-x-4 p-4 text-gray-700 hover:bg-gray-100"
      onClick={() => {
        addMessage("", "user");
      }}
    >
      <PlusCircle size={24} />
      <span className="font-medium">Add Message</span>
    </button>
  );
}

export default function Messages() {
  const { messages, loading, submit } = useChat();

  return (
    <div className="flex grow flex-col justify-between md:grow">
      <div className="my-4 flex flex-col items-stretch overflow-y-auto px-4">
        {messages.map((message) => (
          <Message key={message.idx} message={message} />
        ))}
        <AddMessage />
      </div>
      <div className="flex gap-3 bg-white p-4">
        <button
          className="w-[80px] rounded bg-green-600 p-2 text-white hover:bg-green-600"
          onClick={submit}
        >
          {loading ? (
            <div className="mx-auto h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}
