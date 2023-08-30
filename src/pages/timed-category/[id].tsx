import { api } from "~/utils/api";
import type { AppRouter } from '~/server/api/root';
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { LoadingPage } from "~/components/loading";
import NotFoundPage from "../404";
import { TransactionCard } from "~/components/transaction-card";
import dayjs from "dayjs";
import { sum } from "~/helpers/utils";
import type { inferRouterOutputs } from '@trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>

type TimedCategoryWithTransactions = RouterOutput['timedCategory']['getAllInPeriodWithTransactions'][number]


const TimedCategory: NextPage = () => {
    const router = useRouter()
    const { id, timedCategoryData } = router.query

    let timedCategoryInitialData: TimedCategoryWithTransactions | undefined;
    try {
        timedCategoryInitialData = JSON.parse(window.atob(timedCategoryData as string)) as TimedCategoryWithTransactions
    } catch (error) {
        timedCategoryInitialData = undefined
    }

    const { data: timedCategory, isLoading } = api.timedCategory.getById.useQuery({
        id: id as string
    }, {
        initialData: timedCategoryInitialData
    })

    const total = sum(timedCategory?.transactions.map(t => t.amount) || [])

    return (
        <>
            <h2 className="flex justify-between items-baseline">{timedCategory?.name || "Loading"} {timedCategory && <span className="font-light">{dayjs(timedCategory.startDate).format("YYYY MMMM")}</span>}</h2>
            {isLoading && <LoadingPage />}
            {!isLoading && !timedCategory && <NotFoundPage />}
            {
                (timedCategory && !isLoading) &&
                <div className="mt-4">
                    <div className="flex justify-between mb-4 dark:bg-slate-700 bg-slate-200 p-4 rounded">
                        <span className="flex">
                            <p className="mr-2">Budget</p>
                            <p>€{timedCategory.budget}</p>
                        </span>
                        |
                        <span className="flex">
                            <p className="mr-2">Total used</p>
                            <p>€{total}</p>
                        </span>
                    </div>
                    {
                        timedCategory.transactions.map(transaction => <TransactionCard key={transaction.id} transaction={transaction} />)
                    }
                </div>
            }
        </>

    );
};

export default TimedCategory;
