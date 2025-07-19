'use client';

import Confetti from 'react-confetti';


export default function PuppyShowerPage() {

    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    return (
        <div className="relative overflow-hidden bg-white min-h-screen">
            {/* Confetti celebration! */}
            <Confetti width={getWindowDimensions().width} height={getWindowDimensions().height} numberOfPieces={250} recycle={false} />

            <div className="text-center py-20 px-4">
                <h1 className="text-4xl font-bold mb-2">🎉 Welcome Maya!</h1>
                <p className="text-lg text-gray-700">
                    Let’s celebrate this amazing pup and their forever home.
                </p>

                {/* Add photo/message/etc here */}
            </div>
        </div>
    );
}
