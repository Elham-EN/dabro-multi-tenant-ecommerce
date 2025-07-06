import { Checkbox } from "@/components/ui/checkbox";
import { useTRPC } from "@/lib/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import React from "react";

interface TagsProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export default function TagsFilter({
  value,
  onChange,
}: TagsProps): React.ReactElement {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        { limit: 10 },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );
  const onClick = (tag: string) => {
    // If tag is already in the list
    if (value?.includes(tag)) {
      // We remove it from the list
      onChange(value.filter((t) => t !== tag) || []);
    } else {
      // Add it to the list, if not in the list
      onChange([...(value || []), tag]);
    }
  };
  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onClick(tag.name)}
            >
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          ))
        )
      )}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="underline font-medium justify-start text-start cursor-pointer disabled:opacity-50"
        >
          Load more...
        </button>
      )}
    </div>
  );
}
