import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SunMoon } from "lucide-react";

export default function Layout({ children }: React.PropsWithChildren) {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Head>
        <title>Budgetlytics</title>
        <meta name="description" content="Budgetlytics web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b border-b-neutral-200 bg-white dark:border-b-neutral-500 dark:bg-neutral-950">
          <div className="mx-auto container flex py-2 pl-6 pr-2 justify-between items-center">
            <Link href={"/"}>
              <p className="large">Budgetlytics</p>
            </Link>
            <div className="flex space-x-2">
              {user && <UserButton userProfileMode={"modal"} />}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={"sm"}>
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={"mr-2"}>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      theme === "dark" ? setTheme("light") : setTheme("dark")
                    }
                  >
                    <span className="pr-2">Change theme</span> <SunMoon />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/category">All categories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/category/new">New category</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transaction/new">New transaction</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* <ThemeButton />  */}
            </div>
          </div>
        </header>
        <div className="h-full mx-auto container px-6 py-6">
          <SignedIn>{children}</SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="my-auto">Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </main>
    </>
  );
}
