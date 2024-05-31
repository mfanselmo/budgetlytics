import { type NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import NotFoundPage from "../404";
import { CategoryCard } from "~/components/category-card";

const AllCategories: NextPage = () => {
  const { data, isLoading } = api.category.getAll.useQuery({});

  return (
    <>
      <h2>Categories</h2>
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
