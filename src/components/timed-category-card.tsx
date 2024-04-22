// Todo: extract to types file
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import type { AppRouter } from "~/server/api/root";
import { Plus, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { sum } from "~/helpers/utils";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useContext } from "react";
import { PeriodContext } from "~/context/period";
import formatCurrency from "~/helpers/currency";

type RouterOutput = inferRouterOutputs<AppRouter>;
type TimedCategoryWithTransactions =
  RouterOutput["timedCategory"]["getAllInPeriodWithTransactions"][number];
type TimedCategoryWithoutTransactions =
  RouterOutput["category"]["getById"]["timedCategories"][number];

export const TimedCategoryCard = ({
  timedCategory,
}: {
  timedCategory: TimedCategoryWithTransactions;
}) => {
  const totalUsed = sum(timedCategory.transactions.map((t) => t.amount));

  return (
    <div className="py-3 first:pt-0 flex flex-col border-b border-b-neutral-200 dark:border-b-neutral-700 last:border-0">
      <div className="flex items-center">
        <span className="font-bold flex-grow">{timedCategory.name}</span>
        <Link
          className="mr-1"
          href={{
            pathname: `/timed-category/${timedCategory.id}`,
            query: {
              timedCategoryData: window.btoa(JSON.stringify(timedCategory)),
            },
          }}
        >
          <Button size={"square-sm"} variant={"outline"}>
            <Eye />
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/transaction/new",
            query: { timedCategoryId: timedCategory.id },
          }}
        >
          <Button size={"square-sm"} variant={"outline"}>
            <Plus />
          </Button>
        </Link>
      </div>
      <div className="flex items-center mt-1">
        <span className="mr-4 text-sm">
          <span className="font-extralight mr-0.5">
            {formatCurrency(totalUsed, timedCategory.currency)}/
          </span>
          {formatCurrency(timedCategory.budget, timedCategory.currency)}
        </span>
        <Progress value={(100 * totalUsed) / timedCategory.budget} />
      </div>
    </div>
  );
};

export const SimplifiedTimedCategoryCard = ({
  timedCategory,
}: {
  timedCategory: TimedCategoryWithoutTransactions;
}) => {
  const router = useRouter();
  const period = useContext(PeriodContext);

  void router.prefetch(`/transaction/new?timedCategoryId=${timedCategory.id}`);

  const handleClick = () => {
    // Manually set the date to the period of the timed category in the settings: Equivalent to scrolling to the date
    period.setPeriod(dayjs(timedCategory.startDate));
    void router.push({
      pathname: "/transaction/new",
      query: { timedCategoryId: timedCategory.id },
    });
  };
  return (
    <div className="py-3 first:pt-0 flex flex-col border-b border-b-neutral-200 dark:border-b-neutral-700 last:mb-8  last:border-0">
      <div className="flex items-center">
        <span className="font-bold flex-grow">
          {dayjs(timedCategory.startDate).format("YYYY MMMM")}
        </span>
        <Link
          className="mr-1"
          href={{ pathname: `/timed-category/${timedCategory.id}` }}
        >
          <Button size={"square-sm"} variant={"outline"}>
            <Eye />
          </Button>
        </Link>
        <Button size={"square-sm"} variant={"outline"} onClick={handleClick}>
          <Plus />
        </Button>
      </div>
    </div>
  );
};
