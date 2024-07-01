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
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Head>
        <title>Budgety</title>
        <meta name="description" content="Budgety web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b border-b-neutral-200 bg-white dark:border-b-neutral-500 dark:bg-neutral-950">
          <div className="mx-auto container flex py-2 pl-6 pr-2 justify-between items-center">
            <Link href={"/"}>
              <p className="large">Budgety</p>
            </Link>
            <div className="flex space-x-2 items-center">
              <SunMoon
                role="button"
                onClick={() =>
                  theme === "dark" ? setTheme("light") : setTheme("dark")
                }
              />
              <SignedIn>
                <UserButton userProfileMode={"modal"} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size={"sm"}>
                      Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={"mr-2"}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/category">All categories</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/category/new">New category</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/transaction/new">New transaction</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/api-docs"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        API docs
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="my-auto">Sign in</Button>
                </SignInButton>
              </SignedOut>

              {/* <ThemeButton /> */}
            </div>
          </div>
        </header>
        <div className="h-full mx-auto container px-6 py-6">{children}</div>
      </main>
    </>
  );
}
