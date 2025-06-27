"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema } from "@/modules/auth/schema";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export default function SignInView() {
  const [showPasssword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const trpc = useTRPC();
  const login = useMutation(trpc.auth.login.mutationOptions());

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>): void => {
    login.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          form.reset();
          router.push("/");
          toast.success("You have successfully registered");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
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
                <Link prefetch href={"/sign-up"}>
                  Sign up
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">Welcome back to Dabro.</h1>
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
                      {showPasssword ? (
                        <EyeOff
                          onClick={() => setShowPassword(false)}
                          className="absolute top-3 right-8 cursor-pointer hover:text-[#8d8d88]"
                        />
                      ) : (
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
              disabled={login.isPending}
              type="submit"
              size={"lg"}
              variant={"elevated"}
              className="mt-8 bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              {login.isPending ? "Signing now" : "Sign in"}
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
