import { type NextPage } from "next";

import { api } from "~/utils/api";
import Link from "next/link";

const Home: NextPage = () => {
  const {data} = api.category.getAll.useQuery()
  return (
    <>
        <p>Signed in test</p>
        {
          data?.map(category => (<div key={category.id}>{category.name}</div>))
        }
        <Link href="/category/new">New Category</Link>
    </>
  );
};

export default Home;
