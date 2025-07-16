// Note: DepositsList reflects the user's reserved puppies with deposits paid.
// It displays the puppy's photo, breeder's name, and options to chat or view the puppy's details.

"use client";

import Link from "next/link";
import Image from "next/image";
import DogImage from "@/components/DogImage";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function DepositsList({ deposits }: { deposits: any[] }) {
  const hasDeposits = deposits.length > 0;

  return hasDeposits ? (
    <ul className="space-y-4">
      {deposits.map((deposit) => (
        <Card
          key={deposit._id}
          className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6 flex flex-col md:flex-row items-start gap-6 md:items-center hover:shadow-md transition-shadow duration-200"
        >
             <Badge className="hidden sm:block absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-md">
                Deposit Paid
              </Badge>

          <div className="w-full sm:w-[180px] md:w-40 h-28 overflow-hidden rounded-md flex-shrink-0">
            <DogImage
              src={deposit.dog.photoUrl}
              alt={deposit.dog.name}
              width={175}
              height={95}
              additionalContainerStyles="rounded-md rounded-br-md"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <h2 className="text-lg font-semibold">{deposit.dog.name}</h2>
              <Badge className="block sm:hidden bg-green-100 text-green-700 text-xs px-3 py-1 rounded-md">
                Deposit Paid
              </Badge>
            </div>
            </div>

            <p className="text-sm text-gray-600 mb-1">{deposit.breederName}</p>
            <p className="text-sm text-gray-600 mb-1">
              Amount Paid: <span className="font-medium text-gray-800">${deposit.depositAmount.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Paid On: <span className="font-medium text-gray-800">
                {new Date(deposit.depositPaidAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>

            <div className="flex gap-6 mt-3">
              <Link
                href={`/profile/messages?conversation=${deposit.conversationId}`}
                className="text-blue-600 text-sm hover:underline"
              >
                Chat with Breeder
              </Link>
              <Link
                href={`/dogs/${deposit.dog._id}`}
                className="text-blue-600 text-sm hover:underline"
              >
                View Puppy
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">
      You don’t have any reserved puppies yet.
    </p>
  );
}
