// Todo: extract to types file
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import type { AppRouter } from "~/server/api/root";
import { Plus, Eye } from "lucide-react";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import formatCurrency from "~/helpers/currency";

type RouterOutput = inferRouterOutputs<AppRouter>;

type Transaction =
  RouterOutput["timedCategory"]["getById"]["transactions"][number];

export const TransactionCard = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  return (
    <div className="mx-2 py-2 first:pt-0 flex border-b border-b-neutral-200 dark:border-b-neutral-700 last:mb-8  last:border-0">
      <div className="text-sm flex-grow items-center grid grid-cols-6">
        <span className="col-span-2 font-light text-sm">
          {dayjs(transaction.createdAt).format("DD/MM/YYYY")}
        </span>
        <span className="col-span-2 font-bold capitalize">
          {transaction.name}
        </span>
        <span className="col-span-2 flex flex-end">
          {formatCurrency(transaction.amount, transaction.currency)}
        </span>
      </div>
      <Link
        className="mr-1"
        href={{ pathname: `/transaction/${transaction.id}` }}
        prefetch={false}
      >
        <Button size={"square-sm"} variant={"outline"}>
          <Eye />
        </Button>
      </Link>
    </div>
  );
};
