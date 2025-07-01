'use client';

import { useEffect } from "react";
import { toast } from "sonner";

export default function SignOutToast() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("signout-success") === "true") {
        toast.success("You have been signed out successfully.");
        localStorage.removeItem("signout-success");
      }
    }
  }, []);

  return null; // This component does not render anything
}