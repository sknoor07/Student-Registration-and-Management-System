"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        results: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const studentsRes = await api.get("/admin/students/details");
                const coursesRes = await api.get("/admin/courses");
                const resultsRes = await api.get("/admin/results");

                setStats({
                    students: studentsRes?.data?.student?.length,
                    courses: coursesRes?.data?.courses?.length,
                    results: resultsRes?.data?.count?.length,
                });

            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{stats.students}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{stats.courses}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{stats.results}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
