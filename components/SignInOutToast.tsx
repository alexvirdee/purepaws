'use client';

import { useEffect } from "react";
import { toast } from "sonner";

export default function SignOutToast() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for signin-success flag
      if (localStorage.getItem("signin-success") === "true") {
        toast.success("You have signed in successfully.");
        localStorage.removeItem("signin-success");
      }

      // Check if the signout-success flag is set in localStorage
      if (localStorage.getItem("signout-success") === "true") {
        toast.success("You have been signed out successfully.");
        localStorage.removeItem("signout-success");
      }
    }
  }, []);

  return null; // This component does not render anything
}