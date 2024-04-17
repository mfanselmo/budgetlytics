// Todo: extract to types file
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import type { AppRouter } from "~/server/api/root";
import { Plus, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { sum } from "~/helpers/utils";
import formatCurrency from "~/helpers/currency";

type RouterOutput = inferRouterOutputs<AppRouter>;
type TimedCategoryWithTransactions =
  RouterOutput["timedCategory"]["getAllInPeriodWithTransactions"][number];

export const TotalCard = ({
  timedCategories,
}: {
  timedCategories: TimedCategoryWithTransactions[];
}) => {
  const totalAvailable = sum(timedCategories.map((t) => t.budget));
  const totalUsed = timedCategories.reduce((acc, curr) => {
    const aux = sum(curr.transactions.map((t) => t.amount));
    return acc + aux;
  }, 0);
  const currency = (timedCategories[0] && timedCategories[0].currency) || "CLP";

  return (
    <div className="py-3  flex flex-col mt-4 -mx-6 px-6 border-t-8 border-t-slate-100 dark:border-t-slate-700">
      <div className="flex items-center">
        <span className="font-bold flex-grow">Total</span>
      </div>
      <div className="flex items-center mt-1">
        <span className="mr-2 text-sm">
          <span className="font-extralight mr-0.5">
            {formatCurrency(totalUsed, currency)}/
          </span>
          {formatCurrency(totalAvailable, currency)}
        </span>
        <Progress value={(100 * totalUsed) / totalAvailable} />
      </div>
    </div>
  );
};
