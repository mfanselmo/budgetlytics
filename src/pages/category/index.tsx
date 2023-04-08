import { type NextPage } from "next";
import { api } from "~/utils/api";
import Link from "next/link"
import { Button } from "~/components/ui/button";

const AllCategories: NextPage = () => {

  const { data } = api.category.getAll.useQuery()
  return (
    <>
      <h2>Categories</h2>
      <div className="mt-4">
        <div>
          {
            data?.map(category => (
              <div key={category.id} className="h-12 flex items-center border-b border-b-slate-200 dark:border-b-slate-700 last:mb-8">
                <span className="font-bold mr-4">{category.name}</span>
                <span>€{category.budget}</span>
              </div>
            ))
          }
        </div>
        <Link href="/category/new" >
          <Button>
            New Category
          </Button>
        </Link>
      </div>
    </>
  );
};

export default AllCategories;
