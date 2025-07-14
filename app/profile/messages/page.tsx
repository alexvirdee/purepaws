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

  // Group puppyInterests by conversationId
  const grouped = new Map<string, { conversationId: string; dogs: string[]; breederName: string }>();

  for (const pi of puppyInterestsWithConversations) {
    if (!pi.conversationId) continue;

    if (!grouped.has(pi.conversationId)) {
      grouped.set(pi.conversationId, {
        conversationId: pi.conversationId,
        dogs: [],
        breederName: pi.breederName || "Unknown Breeder",
      });
    }

    const entry = grouped.get(pi.conversationId);
    if (pi.dog?.name && !entry!.dogs.includes(pi.dog.name)) {
      entry!.dogs.push(pi.dog.name);
    }
  }

  const groupedConversations = Array.from(grouped.values());

  console.log('groupedConversations:', groupedConversations);

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
      {groupedConversations.length > 0 ? (
        <div className="flex border rounded-lg shadow overflow-hidden">
          {/* Left column: Conversations list */}
          <div className="w-1/3 border-r">
            {groupedConversations.map((interest, index) => (
              <Link
                key={index}
                href={`/profile/messages?conversation=${interest.conversationId}`}
                className={`block p-4 cursor-pointer hover:bg-gray-50 ${activeConversationId === interest.conversationId
                  ? "bg-gray-100"
                  : ""
                  }`}
              >
                <p className="font-semibold text-gray-800">
                  {interest.breederName}
                </p>
                 <p className="text-xs text-gray-500">
                  {interest.dogs.length > 0
                    ? `Regarding ${interest.dogs.join(", ")}`
                    : "No dogs specified"}
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
