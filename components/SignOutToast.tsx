'use client';

import { useEffect } from "react";
import { toast } from "sonner";

export default function SignOutToast() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("signout-success") === "true") {
        toast.success("You have been signed out successfully.");
        setTimeout(() => {
            localStorage.removeItem("signout-success");
        }, 3000); // Remove the flag after 3 seconds
      }
    }
  }, []);

  return null; // This component does not render anything
}