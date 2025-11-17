import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReviewsGetOneOutput } from "@/modules/reviews/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import StarPicker from "@/components/ui/StarPicker";
import { useTRPC } from "@/lib/trpc/client";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  productId: string;
  initialData?: ReviewsGetOneOutput;
};

const formSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating is required" })
    .max(5),
  description: z
    .string()
    .min(1, { message: "Description is required" }),
});

export default function ReviewForm({
  productId,
  initialData,
}: Props): React.ReactElement {
  // Detect if this form will be an edit or a creation of a
  // new review based on the initial data. isPreview = true if
  // initial review data exist otherwise it is false
  const [isPreview, setIsPreview] = useState<boolean>(
    Boolean(initialData)
  );

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({
            productId,
          })
        );
        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({
            productId,
          })
        );
        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        rating: values.rating,
        description: values.description,
      });
    } else {
      createReview.mutate({
        productId,
        rating: values.rating,
        description: values.description,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4 border-2 p-2 rounded-md  "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="font-medium">
          {isPreview
            ? "Your rating:"
            : "Liked it? Give it a rating"}
        </p>
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Want to leave a written review?"
                  disabled={isPreview}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            variant={"elevated"}
            disabled={
              createReview.isPending ||
              updateReview.isPending
            }
            type="submit"
            size={"lg"}
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            {initialData ? "Update review" : "Post review"}
          </Button>
        )}
      </form>
      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          variant={"elevated"}
          size={"lg"}
          type="button"
          className="w-fit mt-4"
        >
          Edit
        </Button>
      )}
    </Form>
  );
}
