'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  conversationId: string;
}

export default function ReopenConversationButton({ conversationId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleReopen = async () => {
    await fetch(`/api/conversations/${conversationId}/reopen`, {
      method: 'PATCH',
    });

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleReopen}
      disabled={isPending}
      className="text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer"
    >
      {isPending ? 'Reopening...' : 'Reopen Conversation'}
    </button>
  );
}
