"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatWidget from "../../ChatWidget";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { IConversation } from "@/interfaces/conversation";

export default function BreederMessages({
    conversations,
    activeConversationId,
    currentUserRole
}: {
    conversations: IConversation[];
    activeConversationId: string | null;
    currentUserRole: string;
}) {
    const router = useRouter();
    const [messages, setMessages] = useState([]);

    const handleCloseConversation = async (conversationId: string) => {
        try {
            const res = await fetch(`/api/conversations/${conversationId}/close`, {
                method: "PATCH",
            });

            if (!res.ok) {
                throw new Error("Failed to close conversation");
            }

            toast.success("Conversation closed");

            // Optionally: refresh the page or fetch conversations again
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Could not close conversation");
        }
    };

    console.log('conversations', conversations);

    const activeConversation = conversations.find(
        (c) => c._id === activeConversationId
    );

    return (
        <div className="flex border rounded-lg shadow overflow-hidden">
            {/* Left: Conversations */}
            <div className="w-1/3 border-r overflow-y-auto">
                {conversations
                    .filter((c) => !c.closed)
                    .map((c, idx) => (
                        <ContextMenu key={idx}>
                            <ContextMenuTrigger>
                                <div
                                    onClick={() =>
                                        router.push(`/dashboard/clients/messages?conversation=${c._id}`)
                                    }
                                    className={`p-4 cursor-pointer transition-colors ${activeConversationId === c._id ? "bg-gray-100" : ""
                                        }`}
                                >
                                    <p className="text-md text-gray-600">{c.buyerName}</p>
                                    <p className="text-xs text-gray-500 pt-2">
                                        Regarding: {c.dogs.map((dog: any) => dog.name).join(", ")}
                                    </p>
                                </div>
                            </ContextMenuTrigger>

                            <ContextMenuContent>
                                <ContextMenuItem
                                    onClick={() => handleCloseConversation(c._id)}
                                    className="text-gray-500 focus:text-gray-600 cursor-pointer"
                                >
                                    Close Conversation
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    ))}
            </div>

            {/* Right: Chat panel */}
            <div className="flex-1 p-4">
                {activeConversationId && activeConversation && !activeConversation.closed ? (
                    <ChatWidget
                        conversationId={activeConversationId}
                        currentUserRole={currentUserRole}
                    />
                ) : activeConversation?.closed ? (
                    <p className="text-gray-500">This conversation has been closed.</p>
                ) : (
                    <p>Select a conversation</p>
                )}
            </div>
        </div>
    );
}
