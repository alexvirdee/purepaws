// app/profile/messages/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getUserProfileData } from "@/lib/db/getUserProfileData"; // assuming you add conversationIds there
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

interface MessagesPageProps {
  searchParams: {
    conversation?: string;
  };
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  // 1) Get session
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  // 2) If they’re a breeder, redirect them back to dashboard
  if (session.user?.role === "breeder") {
    redirect("/dashboard/messages");
  }

  // 3) Get user’s profile data (which now includes conversationIds)
  const profile = await getUserProfileData();

  const puppyInterestsWithConversations = profile.puppyInterests.filter(
    (pi) => typeof pi.conversationId === "string" && pi.conversationId
  );

  const activeConversationId = (await searchParams).conversation || null;

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Your Messages</h1>
      <div className="flex flex-row gap-4 mb-2">
        <Link href="/profile" className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>
      </div>
      {puppyInterestsWithConversations.length > 0 ? (
        <div className="flex border rounded-lg shadow overflow-hidden">
          {/* Left column: Conversations list */}
          <div className="w-1/3 border-r">
            {puppyInterestsWithConversations.map((interest) => (
              <Link
                key={interest._id}
                href={`/profile/messages?conversation=${interest.conversationId}`}
                className={`block p-4 cursor-pointer hover:bg-gray-50 ${activeConversationId === interest.conversationId
                  ? "bg-gray-100"
                  : ""
                  }`}
              >
                <p className="font-semibold">{interest.dog?.name || "Unknown Dog"}</p>
                <p className="text-xs text-gray-500">
                  ID: {interest.conversationId}
                </p>
              </Link>
            ))}
          </div>

          {/* Right column: Chat widget */}
          <div className="flex-1 p-4">
            {activeConversationId ? (
              <ChatWidget conversationId={activeConversationId} />
            ) : (
              <p className="text-gray-500">Select a conversation</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          You don’t have any conversations with breeders yet.
        </p>
      )}
    </main>
  );
}
