import { type NextPage } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const Home: NextPage = () => {
  return (
    <>
      <h2>Actions</h2>

      <div className="mt-4 flex justify-between">
        <Link href="/category">
          <Button>
            All categories
          </Button>
        </Link>
        <Link href="/category/new">
          <Button>
            New Category
          </Button>
        </Link>

      </div>
    </>
  );
};

export default Home;
