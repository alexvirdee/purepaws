'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, PartyPopper } from 'lucide-react';
import LoadingPage from '@/app/loading';

interface PuppyDetails {
    dogName: string;
    requestId: string;
}

export default function DepositSuccessClient() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [puppy, setPuppy] = useState<PuppyDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!sessionId) {
            router.replace('/');
            return;
        }

        fetch(`/api/deposits/success?session_id=${sessionId}`)
            .then(async (res) => {
                const data = await res.json();

                console.log('res', res.status, data);

                if (!res.ok) {
                    console.log('issue with the api call')
                    // router.replace('/');
                    // return;
                }
                setPuppy(data);
                setLoading(false);
            })
            .catch(() => {
                router.replace('/');
            });
            
    }, [sessionId, router]);

    if (loading) {
        return (
            <LoadingPage />
        );
    }


    return (
        <div className="flex flex-col items-center justify-center text-center px-4 py-10 bg-white">
            <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold mb-2">
                Deposit Complete!
            </h1>
            <p className="text-lg max-w-xl mb-6">
                You’ve successfully placed a deposit for <strong>{puppy?.dogName}</strong>!<br />
                Your breeder will be in touch shortly.
            </p>

            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 max-w-md mb-6">
                <div className="flex items-center justify-center gap-2 font-semibold text-lg">
                    <PartyPopper className="w-5 h-5" />
                    Celebrate with a Puppy Shower!
                </div>
                <p className="text-sm text-gray-700 mt-1">
                    Invite friends and family to welcome your new pup with a custom page.
                </p>
                <Link
                    href={`/puppy-shower/create?requestId=${puppy?.requestId}`}
                    className="mt-3 inline-block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Create Puppy Shower Page
                </Link>
            </div>

            <Link
                href="/profile/deposits"
                className="text-blue-600 hover:underline"
            >
                View My Deposits
            </Link>
        </div>
    );
}
