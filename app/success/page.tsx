import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
    <h1 className="text-4xl font-bold mb-4">✅ Application Submitted!</h1>
    <p className="text-lg mb-6 max-w-xl">
      Thank you for submitting your kennel application.
      Our team will review your details to ensure they meet our high standards
      for responsible breeding. You’ll receive an email once your kennel is
      approved and live on the map!
    </p>

    <Link
      href="/"
      className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      ← Back to Home
    </Link>
  </main>
  );
}