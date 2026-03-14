'use client';

import { Toaster } from 'react-hot-toast';
import { RedirectIfAuthenticated } from '@/components/auth';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RedirectIfAuthenticated>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1B4332',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '12px 16px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#95D5B2',
                            secondary: '#1B4332',
                        },
                    },
                    error: {
                        style: {
                            background: '#E63946',
                        },
                    },
                }}
            />
            {children}
        </RedirectIfAuthenticated>
    );
}
