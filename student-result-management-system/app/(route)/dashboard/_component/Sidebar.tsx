"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
    Menu,
    LayoutDashboard,
    BookOpen,
    FileText,
    Users,
    GraduationCap,
} from "lucide-react";

export default function Sidebar() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("sidebarCollapsed") === "true";
        }
        return false;
    });



    const studentMenu = [
        {
            name: "Dashboard",
            path: "/dashboard/student",
            icon: LayoutDashboard,
        },
        {
            name: "My Results",
            path: "/dashboard/student/results",
            icon: FileText,
        },
        {
            name: "Subjects",
            path: "/dashboard/student/subjects",
            icon: BookOpen,
        },
    ];

    const adminMenu = [
        {
            name: "Dashboard",
            path: "/dashboard/admin",
            icon: LayoutDashboard,
        },
        {
            name: "Manage Students",
            path: "/dashboard/admin/students",
            icon: Users,
        },
        {
            name: "Manage Subjects",
            path: "/dashboard/admin/subjects",
            icon: BookOpen,
        },
        {
            name: "Manage Results",
            path: "/dashboard/admin/results",
            icon: GraduationCap,
        },
    ];

    const menu = user?.role === "admin" ? adminMenu : studentMenu;

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", String(collapsed));
    }, [collapsed]);

    return (
        <div
            className={`bg-zinc-900 border-r border-zinc-800 h-screen transition-all duration-300 ${collapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Toggle */}
            <div className="flex justify-end p-4">
                <button onClick={() => setCollapsed(!collapsed)}>
                    <Menu className="text-white" />
                </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2 px-2">
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive
                                ? "bg-indigo-600 text-white"
                                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                } ${collapsed ? "justify-center" : ""}`}
                        >
                            <Icon size={18} />

                            {!collapsed && <span className="text-sm">{item.name}</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
