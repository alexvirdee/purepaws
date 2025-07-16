// components/profile/DepositsList.tsx

"use client";

import Link from "next/link";
import Image from "next/image";

export default function DepositsList({ deposits }: { deposits: any[] }) {
  const hasDeposits = deposits.length > 0;

  return hasDeposits ? (
    <ul className="space-y-4">
      {deposits.map((deposit) => (
        <li
          key={deposit._id}
          className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4"
        >
          <div className="w-full md:w-1/3 flex-shrink-0">
            <Image
              src={deposit.dog.photoUrl}
              alt={deposit.dog.name}
              width={200}
              height={150}
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold">{deposit.dog.name}</h2>
              <p className="text-gray-500 mb-2">
                Breeder: {deposit.breederName}
              </p>
              <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                Deposit Paid ✅
              </span>
            </div>
            <div className="mt-4 flex gap-4">
              <Link
                href={`/profile/messages?conversation=${deposit.conversationId}`}
                className="text-blue-600 underline text-sm"
              >
                Chat with Breeder
              </Link>
              <Link
                href={`/dogs/${deposit.dog._id}`}
                className="text-blue-600 underline text-sm"
              >
                View Puppy
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">
      You don’t have any reserved puppies yet.
    </p>
  );
}
