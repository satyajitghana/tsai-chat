"use client";

import { useState } from "react";
import TextArea from "./TextArea";
import { useChat } from "@/context/ChatProvider";

export default function SystemMessage() {
  const { updateSystemMessage, systemMessage } = useChat();

  return (
    <TextArea
      title="System"
      className="grow"
      placeholder="You are a helpful assistant."
      value={systemMessage.content}
      onChange={(e) => updateSystemMessage(e.target.value)}
    />
  );
}
