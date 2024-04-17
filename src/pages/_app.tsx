import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/layout";
import { Toaster } from "~/components/ui/toaster";
import { PeriodContext } from "~/context/period";
import dayjs from "dayjs";
import { useState } from "react";
const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryDate, setQueryDate] = useState(dayjs());

  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class">
        <PeriodContext.Provider
          value={{
            date: queryDate,
            increaseMonth: () =>
              setQueryDate((o) => o.set("month", o.month() + 1)),
            decreaseMonth: () =>
              setQueryDate((o) => o.set("month", o.month() - 1)),
            setPeriod: (date: dayjs.Dayjs) => setQueryDate(date),
          }}
        >
          <Toaster />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PeriodContext.Provider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
