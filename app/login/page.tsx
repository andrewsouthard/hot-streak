/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/TBlev4bRP82
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Card className="w-full max-w-md p-6 bg-background shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Hot Streak</h1>
          <p className="text-muted-foreground">
            {isSigningUp ? "Create an account" : "Sign in to your account"}
          </p>
        </div>
        <div className="grid gap-4">
          {isSigningUp ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          {isSigningUp ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => setIsSigningUp(false)}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => setIsSigningUp(true)}
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
