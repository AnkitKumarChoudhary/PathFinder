import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
            <p className="text-lg text-gray-600">
                The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#1B4332] text-white rounded-lg hover:bg-[#2D6A4F] transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
}
