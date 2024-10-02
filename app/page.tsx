// app/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/loading"; // Ensure this component exists
import { postData } from "./utils/sendRequest";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading, setAuthenticated } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  const handleSwitch = () => {
    setIsRegister(!isRegister);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister && formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match.",
      });
      return;
    }

    const endpoint = isRegister ? "/api/register" : "/api/login";

    const { status, message } = await postData(endpoint, {
      email: formData.email,
      password: formData.password,
    });

    toast({
      variant: status === 200 ? "default" : "destructive",
      title: status === 200 ? "Success" : "Error",
      description: status === 200 ? "Login successful" : message,
    });

    if (status === 200) {
      setAuthenticated(true);
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Or display a message like <p>Redirecting...</p>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-center text-2xl font-bold mt-4">
            {isRegister ? "Register" : "Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="text-base sm:text-sm"
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="text-base sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {isRegister && (
              <div className="grid gap-2 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="text-base sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            )}
            <Button type="submit" className="w-full mt-4">
              {isRegister ? "Register" : "Login"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button variant="link" onClick={handleSwitch}>
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
