import { type NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import { TimedCategoryCard } from "~/components/timed-category-card";
import { LoadingPage } from "~/components/loading";
import { Button } from "~/components/ui/button";
import { PeriodContext } from "~/context/period";
import { api } from "~/utils/api";
import NotFoundPage from "./404";
import PeriodChange from "~/components/period-change";
import NewMonthButton from "~/components/new-month-button";
import { TotalCard } from "~/components/total-card";

const Home: NextPage = () => {
  const period = useContext(PeriodContext)
  const { data: timedCategories, isLoading } = api.timedCategory.getAllInPeriodWithTransactions.useQuery({
    month: period.date.month(),
    year: period.date.year(),
  })
  return (
    <>
      <h2 className="items-baseline flex justify-between">
        <span >{period.date.format("MMMM YYYY")}</span>
        <PeriodChange />
      </h2>
      {isLoading && <LoadingPage />}
      {!isLoading && !timedCategories && <NotFoundPage />}
      {
        (timedCategories && !isLoading) &&
        <div className="mt-4">
          <div>
            {timedCategories.map(timedCategory => <TimedCategoryCard timedCategory={timedCategory} key={timedCategory.id} />)}
          </div>
          <TotalCard timedCategories={timedCategories} />
          {!timedCategories.length && <NewMonthButton />}
        </div>
      }
    </>
  );
};

export default Home;
