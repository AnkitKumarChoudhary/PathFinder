'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-[#E76F51]">Something went wrong!</h1>
            <p className="text-lg text-gray-600">{error.message}</p>
            <button
                onClick={reset}
                className="px-6 py-3 bg-[#1B4332] text-white rounded-lg hover:bg-[#2D6A4F] transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}
