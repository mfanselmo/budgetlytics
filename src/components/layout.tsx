import {  SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import ThemeButton from "./theme-button";

export default function Layout({ children }: React.PropsWithChildren) {
  const { user } = useUser()

  return (
    <>
      <Head>
        <title>Budgetlytics</title>
        <meta name="description" content="Budgetlytics web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
        
          <div className="container flex py-2 px-2 justify-between items-center">
            <Link href={"/"} className="flex-1">
              <p className="large">Budgetlytics</p>
            </Link>
            <ThemeButton/>
            {user && <UserButton />}
          </div>
        </header>
        <SignedIn>
          {children}
        </SignedIn>
        <SignedOut>
          <div className="flex justify-center h-full">
            <SignInButton mode="modal">
              <Button className="my-auto">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>
    </>
  )
}