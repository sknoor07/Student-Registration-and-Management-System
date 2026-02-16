"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Result {
    id: number;
    marks: number;
    grade: string;
    course_name: string;
    course_code: string;
    credits: number;
}

export default function StudentResults() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/student/results",
                    { withCredentials: true }
                );

                setResults(res.data.results);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch results");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) return <p>Loading results...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Results</h1>

            {results.length === 0 ? (
                <p className="text-zinc-400">No results yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-zinc-700">
                        <thead className="bg-zinc-900">
                            <tr>
                                <th className="px-4 py-2 text-left">Course</th>
                                <th className="px-4 py-2">Code</th>
                                <th className="px-4 py-2">Credits</th>
                                <th className="px-4 py-2">Marks</th>
                                <th className="px-4 py-2">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-t border-zinc-700 hover:bg-zinc-800"
                                >
                                    <td className="px-4 py-2">{r.course_name}</td>
                                    <td className="px-4 py-2 text-center">{r.course_code}</td>
                                    <td className="px-4 py-2 text-center">{r.credits}</td>
                                    <td className="px-4 py-2 text-center">{r.marks}</td>
                                    <td className="px-4 py-2 text-center">{r.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
