"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatWidget from "../../ChatWidget";

export default function BreederMessages({
    conversations,
    activeConversationId
}: {
    conversations: any[];
    activeConversationId: string | null;
}) {
    const router = useRouter();
    const [messages, setMessages] = useState([]);

    console.log('conversations', conversations);

    return (
        <div className="flex border rounded-lg shadow overflow-hidden">
            {/* Left: Conversations */}
            <div className="w-1/3 border-r">
                {conversations.map((c) => (
                    <div
                        key={c._id}
                        onClick={() =>
                            router.push(`/dashboard/messages?conversation=${c._id}`)
                        }
                        className={`p-4 cursor-pointer ${activeConversationId === c._id ? "bg-gray-100" : ""
                            }`}
                    >
                        <p className="text-md text-gray-600">{c.buyerName}</p>
                        <p className="text-xs text-gray-500 pt-2">
                          Regarding:  {c.dogs.map((dog: any) => dog.name).join(", ")}
                        </p>
                    </div>
                ))}
            </div>

            {/* Right: Chat panel */}
            <div className="flex-1 p-4">
                {activeConversationId ? (
                    <>
                        <ChatWidget conversationId={activeConversationId} />
                    </>
                ) : (
                    <p>Select a conversation</p>
                )}
            </div>
        </div>
    );
}
