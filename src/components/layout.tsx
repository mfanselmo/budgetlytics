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
        
          <div className="mx-auto container flex py-2 px-6 justify-between items-center">
            <Link href={"/"} >
              <p className="large">Budgetlytics</p>
            </Link>
            <div className="flex space-x-2">
              {user && <UserButton />}
              <ThemeButton/>
            </div>
          </div>
        </header>
        <div className="h-full mx-auto container px-6 py-6">
          <SignedIn>
            {children}
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="my-auto">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </main>
    </>
  )
}