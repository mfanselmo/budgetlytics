// Todo: extract to types file
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import type { AppRouter } from "~/server/api/root";
import { Eye, Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import formatCurrency from "~/helpers/currency";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Category = RouterOutput["category"]["getAll"][number];

export const CategoryCard = ({ category }: { category: Category }) => {
  const ctx = api.useUtils();
  const { toast } = useToast();

  const { mutate: deleteCategory, isLoading: isDeleting } =
    api.category.delete.useMutation({
      onSuccess: async () => {
        await ctx.category.getAll.invalidate();
      },
      onError: (e) => {
        toast({
          variant: "destructive",
          title: e.data?.code || "Error",
          description: e.data?.message || "Unknown error",
        });
      },
    });

  return (
    <div className="py-3 first:pt-0 flex flex-col border-b border-b-neutral-200 dark:border-b-neutral-700 last:mb-8  last:border-0">
      <div className="flex items-center">
        <div className="grid grid-cols-4 flex-grow">
          <span className="col-span-2 text-sm font-bold">{category.name}</span>
          <p className="col-span-2 text-sm">
            {formatCurrency(category.budget, category.currency)}
          </p>
        </div>
        <Link className="mr-1" href={{ pathname: `/category/${category.id}` }}>
          <Button size={"square-sm"} variant={"outline"}>
            <Eye />
          </Button>
        </Link>
        <Link
          className="mr-1"
          href={{ pathname: `/category/${category.id}/edit` }}
        >
          <Button size={"square-sm"} variant={"outline"}>
            <Edit />
          </Button>
        </Link>
        {process.env.NODE_ENV === "development" && (
          <Button
            onClick={() => deleteCategory({ id: category.id })}
            loading={isDeleting}
            size={"square-sm"}
            variant={"destructive"}
          >
            <Trash />
          </Button>
        )}
      </div>
    </div>
  );
};
