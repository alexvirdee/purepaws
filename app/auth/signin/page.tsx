'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SignIn() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = form.get('email') as string;
        const password = form.get('password') as string;

        await signIn('credentials', {
            email,
            password,
            callbackUrl: "/"
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <h1 className="text-xl mb-4">Sign In</h1>
                <input name="email" type="email" placeholder="Email" required className="border mb-2 p-2 w-full" />
                <input name="password" type="password" placeholder="Password" required className="border mb-2 p-2 w-full" />
                <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Sign In</Button>
            </form>
        </div>
    )
}