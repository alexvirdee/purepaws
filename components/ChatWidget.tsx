'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatMessage = {
  _id: string;
  sender: "breeder" | "buyer";
  text: string;
  createdAt: string;
};

interface ChatWidgetProps {
  conversationId: string;
  initialMessages?: ChatMessage[];
  onSendMessage?: (text: string) => void; // optional callback
}

export default function ChatWidget({
  conversationId,
  initialMessages = [],
  onSendMessage,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // In a real app, you’d POST this to an API route
    const fakeMessage: ChatMessage = {
      _id: Date.now().toString(),
      sender: "breeder",
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, fakeMessage]);
    setNewMessage("");

    if (onSendMessage) {
      onSendMessage(newMessage.trim());
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg fixed bottom-4 right-4 z-50">
      <CardHeader>
        <CardTitle>Conversation</CardTitle>
        <p className="text-xs text-gray-500">ID: {conversationId}</p>
      </CardHeader>

      <CardContent className="flex flex-col h-[300px]">
        <ScrollArea className="flex-1 mb-4 p-2 border rounded bg-gray-50 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map(msg => (
              <div
                key={msg._id}
                className={`p-2 mb-1 rounded ${
                  msg.sender === "breeder"
                    ? "bg-green-100 text-right"
                    : "bg-blue-100 text-left"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="block text-[10px] text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No messages yet.</p>
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
