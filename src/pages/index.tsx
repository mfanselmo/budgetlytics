import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const {data} = api.category.getAll.useQuery()
  return (
    <>
      <Head>
        <title>Budgetlytics</title>
        <meta name="description" content="Budgetlytics web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SignedIn>
          <p>Signed in test</p>
          {
            data?.map(category => (<div key={category.id}>{category.name}</div>))
          }
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </main>
    </>
  );
};

export default Home;
