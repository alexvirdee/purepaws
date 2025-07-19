import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getUserProfileData } from "@/lib/db/getUserProfileData"; // assuming you add conversationIds there
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import ReopenConversationButton from "@/components/ReopenConversationButton";

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
    redirect("/dashboard/clients/messages");
  }

  const currentUserRole = session?.user?.role as "breeder" | "buyer";

  // 3) Get user’s profile data (which now includes conversationIds)
  const profile = await getUserProfileData();

  // Step 1: Include all puppyInterests with valid conversations
  const puppyInterestsWithConversations = profile.puppyInterests.filter(
    (pi) =>
      typeof pi.conversation?._id === "string" &&
      pi.conversation?._id // include both open and closed here
  );

  // Step 2: Group by conversationId and track `closed` status
  const grouped = new Map<string, {
    conversationId: string;
    dogs: string[];
    breederName: string;
    closed: boolean;
  }>();

  for (const pi of puppyInterestsWithConversations) {
    if (!pi.conversation?._id) continue;

    if (!grouped.has(pi.conversation?._id)) {
      grouped.set(pi.conversation?._id, {
        conversationId: pi.conversation?._id,
        dogs: [],
        breederName: pi.breederName || "Unknown Breeder",
        closed: pi.conversation?.closed || false, // ✅ Include closed flag
      });
    }

    const entry = grouped.get(pi?.conversation?._id);
    if (pi.dog?.name && !entry!.dogs.includes(pi.dog.name)) {
      entry!.dogs.push(pi.dog.name);
    }
  }

  // Step 3: Convert map to array
  const groupedConversations = Array.from(grouped.values());

  // Step 4: Determine which conversation is currently active via URL
  const activeConversationId = (await searchParams).conversation || null;

  // Step 5: Determine if the active conversation is valid (not closed)
  const valid = groupedConversations.find(
    (c) => c.conversationId === activeConversationId && !c.closed
  );

  // Step 6: Track selected regardless of status (for "closed" messaging)
  const selected = groupedConversations.find(
    (c) => c.conversationId === activeConversationId
  );


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
        <div className="flex border border-gray-200 rounded-lg shadow overflow-hidden">
          {/* Left column: Conversations list */}
          <div className="w-1/3 border-r border-r-gray-200">
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
            {activeConversationId && valid ? (
              <ChatWidget
                conversationId={activeConversationId}
                currentUserRole={currentUserRole}
              />
            ) : selected?.closed ? (
              <div className="text-gray-500 italic space-y-2">
                <p>This conversation has been closed by the breeder.</p>
                <ReopenConversationButton conversationId={selected?.conversationId} />
              </div>
            ) : (
              <p className="text-gray-500">Select a conversation</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          You don’t have any conversations yet.<br />
          Once a breeder reaches out to you, they will display here.
        </p>
      )}
    </main>
  );
}
