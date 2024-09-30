"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@components/ui/card";
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
import { useState } from "react";
import { postData } from "@/app/utils/sendRequest";
import { FaEye } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
} from "@components/ui/alert-dialog";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const [language, setLanguage] = useState("en");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  // State for tracking errors and feedback
  const [emailError, setEmailError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAuth();

  // Function to validate email
  const validateEmail = (email: string) => {
    if (email === "") return true; // Allow empty email
    // Simple regex for email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Reset error and success messages
    setSubmissionError("");
    setEmailError("");

    // Validate email only if it's not empty
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true); // Set loading state

    // Build the payload conditionally
    const payload: { language: string; password?: string; email?: string } = {
      language,
    };

    if (password.trim() !== "") {
      payload.password = password;
    }

    if (email.trim() !== "") {
      payload.email = email;
    }

    try {
      const { status, data } = await postData("/api/settings", payload);

      if (status === 200) {
        // Optionally, reset password and email fields after successful submission
        setPassword("");
        setEmail("");
      } else {
        setSubmissionError("An error occurred while saving settings.");
      }
    } catch (error) {
      setSubmissionError("An unexpected error occurred.");
      console.error("Error submitting settings:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  // Handle email input change without real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Removed real-time validation
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pl">Polish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password Change */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button" // Prevents form submission on click
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-3"
                  aria-label="Toggle password visibility"
                >
                  <FaEye />
                </button>
              </div>
            </div>

            {/* Email Change */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">New Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter new email address"
                value={email}
                onChange={handleEmailChange}
                className={`${emailError ? "border-red-500" : ""}`}
              />
              {emailError && (
                <span className="text-red-500 text-sm">{emailError}</span>
              )}
            </div>

            {/* Error and Success Messages */}
            {submissionError && (
              <div className="text-red-500 text-sm">{submissionError}</div>
            )}

            {/* Save Button */}
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setExitModalOpen(true);
                }}
                variant={"outline"}
              >
                <ImExit />
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <AlertDialog open={exitModalOpen} onOpenChange={setExitModalOpen}>
        <AlertDialogContent className="p-2 space-y-6">
          <AlertDialogHeader className="space-y-4">
            <Card className="bg-background border-none">
              <CardHeader className="p-4">
                <CardTitle>Logout</CardTitle>
              </CardHeader>
              <CardContent>Are you sure you want to log out?</CardContent>
              <CardFooter className="flex justify-end p-4 space-x-4">
                <AlertDialogCancel asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setExitModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={handleLogout}>Confirm</Button>
                </AlertDialogAction>
              </CardFooter>
            </Card>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
