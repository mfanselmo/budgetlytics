import { type NextPage } from "next";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { LoadingPage } from "~/components/loading";
import { useContext } from "react";
import { PeriodContext } from "~/context/period";
import { TimedCategoryCard } from "~/components/timed-category-card";
import NotFoundPage from "../404";
import { CategoryCard } from "~/components/category-card";
import PeriodChange from "~/components/period-change";

const AllCategories: NextPage = () => {
  const { data, isLoading } = api.category.getAll.useQuery();
  const period = useContext(PeriodContext);

  return (
    <>
      <h2>Settings</h2>
      {isLoading && <LoadingPage />}
      {!isLoading && !data && <NotFoundPage />}
      {data && !isLoading && (
        <div className="mt-4">
          {data.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default AllCategories;
