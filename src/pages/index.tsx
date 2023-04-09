import { type NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import { CategoryCard } from "~/components/category-card";
import { LoadingPage } from "~/components/loading";
import { Button } from "~/components/ui/button";
import { PeriodContext } from "~/context/period";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const period = useContext(PeriodContext)
  const { data, isLoading: categoriesLoading } = api.timedCategory.getAllInPeriod.useQuery({
    month: period.date.month(),
    year: period.date.year(),
    includeTransactions: true,
  })
  return (
    <>
      <h2 className="items-baseline">Period - <span className="font-light">{period.date.format("MMMM YYYY")}</span></h2>

      <div className="mt-4">
        <div>
          {
            categoriesLoading ?
              <LoadingPage /> :
              data?.map(category => <CategoryCard timedCategory={category} key={category.id} />)
          }
        </div>

      </div>
    </>
  );
};

export default Home;
