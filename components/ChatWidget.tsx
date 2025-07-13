'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

type ChatMessage = {
    _id: string;
    senderRole: "breeder" | "buyer";
    text: string;
    createdAt: string;
};

interface ChatWidgetProps {
    conversationId: string;
    initialMessages?: ChatMessage[];
    onSendMessage?: (text: string) => void; // optional callback
    onClose?: () => void;
}

export default function ChatWidget({
    conversationId,
    initialMessages = [],
    onSendMessage,
    onClose
}: ChatWidgetProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        async function fetchMessages() {
            const res = await fetch(`/api/conversations/${conversationId}/messages`);

            if (!res.ok) {
                setMessages([]);

                return;
            }

            const data = await res.json();
            setMessages(data.messages);
        }

        if (conversationId) fetchMessages();

    }, [conversationId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: newMessage.trim() })
            });

            const data = await res.json();

            if (res.ok) {
                // Append the new message from response
                setMessages(prev => [...prev, {
                    _id: data.message._id,
                    senderRole: data.message.senderRole,
                    text: data.message.text,
                    createdAt: data.message.createdAt,
                }]);

                setNewMessage("");

                if (onSendMessage) {
                    onSendMessage(data.message.text);
                }
            } else {
                toast.error(data.error || "Failed to send message");
                console.error("Failed to send message:", data.error);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between items-start">
                <div>
                    <h1>Conversation</h1>
                    <p className="text-xs text-gray-500">ID: {conversationId}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XIcon className="cursor-pointer w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex flex-col h-[300px]">
                <ScrollArea className="flex-1 mb-4 p-2 border rounded bg-gray-50 overflow-y-auto">
                    {messages.length > 0 ? (
                        messages.map(msg => (
                            <div
                                key={msg._id}
                                className={`p-2 mb-1 rounded ${msg.senderRole === "breeder"
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
            </div>
        </div>
    );
}
