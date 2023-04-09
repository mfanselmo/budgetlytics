// Todo: extract to types file
import type { inferRouterOutputs } from '@trpc/server';
import Link from 'next/link';
import { sum } from '~/helpers/utils';
import type { AppRouter } from '~/server/api/root';
import { Plus } from "lucide-react"
import { Button } from './ui/button';
import { Progress } from './ui/progress';

type RouterOutput = inferRouterOutputs<AppRouter>
type TimedCategoryWithTransactions = RouterOutput['timedCategory']['getAllInPeriod'][number]





export const CategoryCard = ({ timedCategory }: { timedCategory: TimedCategoryWithTransactions }) => {

    const currentAmount = sum(timedCategory.transactions.map(t => t.amount))

    return (
        <div key={timedCategory.id} className="h-14 grid grid-cols-7 border-b border-b-slate-200 dark:border-b-slate-700 last:mb-8 items-center last:border-0">
            <div className="flex justify-between col-span-3">
                <span className="font-bold ">{timedCategory.name}</span>
                <span className="mr-2">€{timedCategory.budget}</span>
            </div>

            <Progress className="col-span-3" value={100 * (currentAmount / timedCategory.budget)} />

            <Link className="col-span-1 justify-self-end" href={{ pathname: '/transaction/new', query: { timedCategoryId: timedCategory.id } }}>
                <Button size={'sm'} variant={'outline'}>
                    <Plus />
                </Button>
            </Link>


        </div>
    );
};