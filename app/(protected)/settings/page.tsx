"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Label } from "@components/ui/label";
import { postData } from "@/app/utils/sendRequest";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import Settings from "@/app/components/Settings";

export default function SettingsPage() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" }); // Check if the device is mobile
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const { status, data } = await postData("/api/settings", {
      language,
      password,
      email,
    });
  };
  useEffect(() => {
    if (!isMobile) {
      // If not on mobile, redirect to a 404 page
      router.replace("/404");
    }
  }, [isMobile, router]);

  return isMobile ? (
    <div className="w-full sm:hidden flex flex-col justify-center h-2/3">
      <Card>
        <Settings />
      </Card>
    </div>
  ) : null;
}
