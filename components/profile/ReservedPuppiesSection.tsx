'use client';

import { IDog } from "@/interfaces/dog";
import RequestCard from "@/components/profile/AdoptionRequestsSection"; // If RequestCard is not exported separately, duplicate structure here

export default function ReservedPuppiesSection({
  adoptionRequests,
}: {
  adoptionRequests: any[];
}) {
  // Only show those with a status of 'deposit-paid'
  const completedDeposits = adoptionRequests?.filter(
    (r) => r.status === 'deposit-paid'
  );

  if (!completedDeposits || completedDeposits.length === 0) {
    return (
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-bold mb-4">Reserved Puppies</h2>
        <p className="text-gray-600">You haven’t completed any deposits yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-bold mb-4">Reserved Puppies</h2>
      <p className="text-gray-600 mb-4">
        You’ve completed a deposit for {completedDeposits.length} pupp{completedDeposits.length > 1 ? 'ies' : 'y'}. View with the link below.
      </p>
      <div className="mt-4">
        <a
          href="/profile/deposits"
          className="text-blue-600 hover:underline font-medium"
        >
          View All Reserved Puppies &rarr;
        </a>
      </div>
    </div>
  );
}
