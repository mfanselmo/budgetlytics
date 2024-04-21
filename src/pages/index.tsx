import { type NextPage } from "next";
import { useContext } from "react";
import { TimedCategoryCard } from "~/components/timed-category-card";
import { LoadingPage } from "~/components/loading";
import { PeriodContext } from "~/context/period";
import { api } from "~/utils/api";
import NotFoundPage from "./404";
import PeriodChange from "~/components/period-change";
import NewMonthButton from "~/components/new-month-button";
import { TotalCard } from "~/components/total-card";

const Home: NextPage = () => {
  const period = useContext(PeriodContext);

  const displayPeriodStartString = period.periodStart.format("DD MMMM");
  const displayPeriodEndString = period.periodEnd.format("DD MMMM");
  const { data: timedCategories, isLoading } =
    api.timedCategory.getAllInPeriodWithTransactions.useQuery({
      startDate: period.periodStart.toDate(),
      endDate: period.periodEnd.toDate(),
    });
  return (
    <>
      <div className="items-center flex justify-between">
        <h4>
          {displayPeriodStartString} - {displayPeriodEndString}
        </h4>
        <PeriodChange />
      </div>
      {isLoading && <LoadingPage />}
      {!isLoading && !timedCategories && <NotFoundPage />}
      {timedCategories && !isLoading && (
        <div className="mt-4">
          <div>
            {timedCategories.map((timedCategory) => (
              <TimedCategoryCard
                timedCategory={timedCategory}
                key={timedCategory.id}
              />
            ))}
          </div>
          <TotalCard timedCategories={timedCategories} />
          {!timedCategories.length && <NewMonthButton />}
        </div>
      )}
    </>
  );
};

export default Home;
