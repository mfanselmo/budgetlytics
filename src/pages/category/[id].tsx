import { api } from "~/utils/api";
import { useContext } from "react";
import { PeriodContext } from "~/context/period";
import { SimplifiedTimedCategoryCard } from "~/components/timed-category-card";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { LoadingPage } from "~/components/loading";
import NotFoundPage from "../404";

const Category: NextPage = () => {
  const period = useContext(PeriodContext);
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = api.category.getById.useQuery({
    id: id as string,
  });

  return (
    <>
      <h2>{data?.name || "Loading"}</h2>
      {isLoading && <LoadingPage />}
      {!isLoading && !data && <NotFoundPage />}
      {data && !isLoading && (
        <div className="mt-4">
          <div>
            {data.timedCategories.map((timedCategory) => (
              <SimplifiedTimedCategoryCard
                timedCategory={timedCategory}
                key={timedCategory.id}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Category;
