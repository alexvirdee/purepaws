import { SignUpForm } from '@/components/forms/auth/SignUpForm';
import Link from 'next/link';
import Image from "next/image";

export default function SignUp() {
    return (
         <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-2">
                <div className="flex justify-center gap-2 ">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/purepaws-logo-transparent.png"
                            alt="Pure Paws Logo"
                            width={150}
                            height={100}
                        />
                    </Link>
                </div>
                <div className="flex flex-1 justify-center">
                    <div className="w-full max-w-xs">
                        <SignUpForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/images/signup-pup.jpg"
                    priority={true}
                    width={800}
                    height={800}
                    alt="Golden puppy"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
