"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/modules/auth/schema";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export default function SignUpView() {
  const [showPasssword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;
  const showPreview: boolean = username && !usernameErrors;
  const passwordValue = form.getValues("password");

  const onSubmit = (values: z.infer<typeof registerSchema>): void => {
    console.log("====================================");
    console.log(values);
    console.log("====================================");
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href={"/"}>
                <span
                  className={cn("text-4xl font-semibold", poppins.className)}
                >
                  Dabro
                </span>
              </Link>
              <Button
                asChild
                variant={"ghost"}
                size={"sm"}
                className="text-base border-none underline"
              >
                <Link prefetch href={"/sign-in"}>
                  Sign in
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">
              Join over 1000 creators earning money on Dabro
            </h1>
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base lg:text-lg">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn("hidden lg:text-base", true && "block")}
                  >
                    {/* TODO: Use proper method to generate preview url */}
                    Your store will be available at&nbsp;
                    <strong>{username}</strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base lg:text-lg">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base lg:text-lg">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative bg-red-400">
                      <Input
                        {...field}
                        type={showPasssword ? "text" : "password"}
                      />
                      {showPasssword
                        ? passwordValue && (
                            <EyeOff
                              onClick={() => setShowPassword(false)}
                              className="absolute top-3 right-8 cursor-pointer hover:text-[#8d8d88]"
                            />
                          )
                        : passwordValue && (
                            <Eye
                              onClick={() => setShowPassword(true)}
                              className="absolute top-3 right-8 cursor-pointer hover:text-[#8d8d88]"
                            />
                          )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size={"lg"}
              variant={"elevated"}
              className="mt-8 bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="bg-green-400 h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
