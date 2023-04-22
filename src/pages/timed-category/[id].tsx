import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { useContext } from "react";
import { PeriodContext } from "~/context/period";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { LoadingPage } from "~/components/loading";
import NotFoundPage from "../404";
import { TransactionCard } from "~/components/transaction-card";
import PeriodChange from "~/components/period-change";
import dayjs from "dayjs";
import { sum } from "~/helpers/utils";



const TimedCategory: NextPage = () => {
    const period = useContext(PeriodContext)
    const router = useRouter()
    const { id } = router.query


    const { data, isLoading } = api.timedCategory.getById.useQuery({
        id: id as string
    })

    const total = sum(data?.transactions.map(t => t.amount) || [])

    return (
        <>
            <h2 className="flex justify-between items-baseline">{data?.name || "Loading"} {data && <span className="font-light">{dayjs(data.startDate).format("YYYY MMMM")}</span>}</h2>
            {isLoading && <LoadingPage />}
            {!isLoading && !data && <NotFoundPage />}
            {
                (data && !isLoading) &&
                <div className="mt-4">
                    <div className="flex justify-between mb-4 dark:bg-slate-700 bg-slate-200 p-4 rounded">
                        <span className="flex">
                            <p className="mr-2">Budget</p>
                            <p>€{data.budget}</p>
                        </span>
                        |
                        <span className="flex">
                            <p className="mr-2">Total used</p>
                            <p>€{total}</p>
                        </span>
                    </div>
                    {
                        data.transactions.map(transaction => <TransactionCard key={transaction.id} transaction={transaction} />)
                    }
                </div>
            }
        </>

    );
};

export default TimedCategory;
