'use client';

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { format } from "date-fns";

export default function BreederApprovalBanner({ breeder }: { breeder: any }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (breeder?.status === "approved" && breeder?.approvedAt) {
      const approvedAt = new Date(breeder.approvedAt);
      const now = new Date();
      const diffInHours = (now.getTime() - approvedAt.getTime()) / (1000 * 60 * 60);

      if (diffInHours <= 24) {
        setShowBanner(true);
      }
    }
  }, [breeder]);

  if (!showBanner) return null;

  return (
    <Alert className="flex justify-between items-start gap-4 bg-green-50 border-green-400">
      <div>
        <AlertTitle className="text-green-800">🎉 You’re Approved!</AlertTitle>
        <AlertDescription className="text-green-700">
          Congratulations, your breeder profile was approved on&nbsp;
          {format(new Date(breeder.approvedAt), "PPP p")}. 
          You can now add dogs, upcoming litters and manage your kennel profile.
        </AlertDescription>
      </div>
      <button
        onClick={() => setShowBanner(false)}
        className="text-green-800 hover:text-green-900"
      >
        <X className="w-4 h-4" />
      </button>
    </Alert>
  );
}