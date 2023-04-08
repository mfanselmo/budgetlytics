import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes"

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/layout";
import { Toaster } from "~/components/ui/toaster";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class">
        <Toaster />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
