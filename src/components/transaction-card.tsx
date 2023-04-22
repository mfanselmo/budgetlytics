// Todo: extract to types file
import type { inferRouterOutputs } from '@trpc/server';
import Link from 'next/link';
import type { AppRouter } from '~/server/api/root';
import { Plus, Eye } from "lucide-react"
import { Button } from './ui/button';
import dayjs from 'dayjs';

type RouterOutput = inferRouterOutputs<AppRouter>

type Transaction = RouterOutput['timedCategory']['getById']['transactions'][number]




export const TransactionCard = ({ transaction }: { transaction: Transaction }) => {

    return (
        <div className="py-2 first:pt-0 flex border-b border-b-slate-200 dark:border-b-slate-700 last:mb-8  last:border-0">
            <div className="flex-grow items-center grid grid-cols-6">
                <span className='col-span-3 font-bold capitalize'>{transaction.name}</span>
                <span className='col-span-2 font-light text-sm'>{dayjs(transaction.createdAt).format("DD/MM/YYYY")}</span>
                <span className='col-span-1 flex-grow'>€{transaction.amount}</span>
            </div>
            <Link className="mr-1" href={{ pathname: `/transaction/${transaction.id}` }}>
                <Button size={'sm'} variant={'outline'}>
                    <Eye />
                </Button>
            </Link>
        </div>
    );
};