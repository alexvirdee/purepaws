import Link from "next/link";

export default function DepositSuccessPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
            <h1 className="text-4xl font-bold mb-4">✅ Deposit Complete!</h1>
            <p className="text-lg mb-6 max-w-xl">
                Thank you for securing your puppy with PurePaws! 🐾<br />
                Your deposit has been received and your breeder will reach out soon.
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