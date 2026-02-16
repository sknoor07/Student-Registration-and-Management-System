"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Navbar from "./_component/Navbar.tsx";
import Sidebar from "./_component/Sidebar.tsx";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="flex">
                    <Sidebar />
                    <div className="flex-1 p-6">{children}</div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
