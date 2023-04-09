import { type NextPage } from "next";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { LoadingPage } from "~/components/loading";
import { useContext } from "react";
import { PeriodContext } from "~/context/period";
import { CategoryCard } from "~/components/category-card";

const AllCategories: NextPage = () => {
  const period = useContext(PeriodContext)
  const { data, isLoading: categoriesLoading } = api.timedCategory.getAllInPeriod.useQuery({
    month: period.date.month(),
    year: period.date.year(),
    // includeTransactions: false,
  })

  console.log(data)
  return (
    <>
      <h2>Categories</h2>
      <div className="mt-4">
        <div>
          {
            categoriesLoading ?
              <LoadingPage /> :
              data?.map(category => <CategoryCard timedCategory={category} key={category.id} />)
          }
        </div>
        <Button onClick={period.increaseMonth}>
          Older
        </Button>
        <Button onClick={period.decreaseMonth}>
          Newer
        </Button>
      </div>
    </>
  );
};

export default AllCategories;
