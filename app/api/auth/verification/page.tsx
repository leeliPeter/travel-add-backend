"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { newVerificationToken } from "@/server/actions/tokens";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";

export default function Verification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = useCallback(async () => {
    if (success || error) return;
    if (!token) {
      setError("No token provided");
      return;
    }
    await newVerificationToken(token).then((data) => {
      if (data.error) {
        setError(data.error);
        setTimeout(() => {
          router.push("/");
        }, 4000);
      } else {
        setSuccess(data.success || "Email verified");
        setTimeout(() => {
          router.push("/");
        }, 4000);
      }
    });
  }, []);

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <div
      id="verification"
      className="flex justify-center items-center h-screen"
    >
      <Card className="w-[400px] z-10 shadow-md">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">
            Email Verification
          </h2>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {success}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
