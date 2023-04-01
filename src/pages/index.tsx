import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";

// import { api } from "~/utils/api";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
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
