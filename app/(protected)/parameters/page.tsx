"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Parameter } from "@/app/types/Parameter";

export default function Parameters() {
    const [parameters, setParameters] = useState<Parameter[]>(
        []
    );

    useEffect(() => {
        fetch("/api/parameters", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => setParameters(data));
    }, []);

    return (
       <Card className="grid border-none col-span-3 grid-rows[1fr,1fr,auto]">
        <CardHeader>
            <CardTitle>Your daily Parameters</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
            {parameters.map((parameter, index) => (
                <div key={index}>
                    <p>{parameter.name}</p>
                    <p>{parameter.goalValue}</p>
                </div>
            ))}
        </CardContent>
        </Card>
    );
    }