import { api } from "~/utils/api";
import type { AppRouter } from "~/server/api/root";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { LoadingPage } from "~/components/loading";
import NotFoundPage from "../404";
import { TransactionCard } from "~/components/transaction-card";
import dayjs from "dayjs";
import { sum } from "~/helpers/utils";
import type { inferRouterOutputs } from "@trpc/server";
import { useToast } from "~/hooks/use-toast";
import { DangerDialog } from "~/components/ui/alert-dialog";
import formatCurrency from "~/helpers/currency";

type RouterOutput = inferRouterOutputs<AppRouter>;

type TimedCategoryWithTransactions =
  RouterOutput["timedCategory"]["getAllInPeriodWithTransactions"][number];

const TimedCategory: NextPage = () => {
  const router = useRouter();
  const { id, timedCategoryData } = router.query;

  const { toast } = useToast();

  let timedCategoryInitialData: TimedCategoryWithTransactions | undefined;
  try {
    timedCategoryInitialData = JSON.parse(
      window.atob(timedCategoryData as string),
    ) as TimedCategoryWithTransactions;
  } catch (error) {
    timedCategoryInitialData = undefined;
  }

  const { data: timedCategory, isLoading } = api.timedCategory.getById.useQuery(
    {
      id: id as string,
    },
    {
      initialData: timedCategoryInitialData,
    },
  );

  const { mutate: deleteTimedCategory, isLoading: isDeleting } =
    api.timedCategory.delete.useMutation({
      onSuccess: async () => {
        await router.push("/");
      },
      onError: (e) => {
        toast({
          variant: "destructive",
          title: e.data?.code || "Error",
          description: e.data?.message || "Unknown error",
        });
      },
    });

  const total = sum(timedCategory?.transactions.map((t) => t.amount) || []);

  return (
    <>
      <div className="flex flex-col justify-between items-baseline">
        <h2 className="border-b-0">{timedCategory?.name || "Loading"}</h2>
        {timedCategory && (
          <h3 className="font-light">
            {dayjs(timedCategory.startDate).format("DD MMMM YYYY")} -{" "}
            {dayjs(timedCategory.endDate).format("DD MMMM YYYY")}
          </h3>
        )}
      </div>
      {isLoading && <LoadingPage />}
      {!isLoading && !timedCategory && <NotFoundPage />}
      {timedCategory && !isLoading && (
        <div className="mt-4">
          <div className="flex justify-between mb-4 dark:bg-neutral-800 bg-neutral-200 p-4 rounded">
            <span className="flex">
              <p className="mr-2">Budget</p>
              <p>
                {formatCurrency(timedCategory.budget, timedCategory.currency)}
              </p>
            </span>
            |
            <span className="flex">
              <p className="mr-2">Total used</p>
              <p>{formatCurrency(total, timedCategory.currency)}</p>
            </span>
          </div>
          {timedCategory.transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-10">
              <DangerDialog
                loading={isDeleting}
                onClick={() => deleteTimedCategory({ id: timedCategory.id })}
              >
                Delete month data
              </DangerDialog>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TimedCategory;
