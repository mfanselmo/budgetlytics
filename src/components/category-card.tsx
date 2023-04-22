// Todo: extract to types file
import type { inferRouterOutputs } from '@trpc/server';
import Link from 'next/link';
import type { AppRouter } from '~/server/api/root';
import { Plus, Eye, Edit } from "lucide-react"
import { Button } from './ui/button';
import { categoryRouter } from '~/server/api/routers/category';

type RouterOutput = inferRouterOutputs<AppRouter>
type Category = RouterOutput['category']['getAll'][number]





export const CategoryCard = ({ category }: { category: Category }) => {

    return (
        <div className="py-3 first:pt-0 flex flex-col border-b border-b-slate-200 dark:border-b-slate-700 last:mb-8  last:border-0">
            <div className="flex items-center">
                <div className='grid grid-cols-4 flex-grow'>
                    <span className="col-span-3 font-bold">{category.name}</span>
                    <p className='col-span-1 '>€{category.budget}</p>
                </div>
                <Link className="mr-1" href={{ pathname: `/category/${category.id}` }}>
                    <Button size={'sm'} variant={'outline'}>
                        <Eye />
                    </Button>
                </Link>
                <Link href={{ pathname: `/category/${category.id}/edit` }}>
                    <Button size={'sm'} variant={'outline'}>
                        <Edit />
                    </Button>
                </Link>
            </div>
        </div>
    );
};