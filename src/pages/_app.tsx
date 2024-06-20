import { ClerkProvider, useUser } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/layout";
import { Toaster } from "~/components/ui/toaster";
import { PeriodContext } from "~/context/period";
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";

const WithClerk = ({ children }: React.PropsWithChildren<{}>) => {
  const { user } = useUser();
  const { data } = api.settings.getPeriodStartDay.useQuery(
    {},
    {
      enabled: !!user,
    },
  );
  const userStartDay = data?.day ?? 1;

  const [periodStart, setPeriodStart] = useState(dayjs());
  const [periodEnd, setPeriodEnd] = useState(dayjs().add(1, "month"));

  const setPeriod = useCallback(
    (date: dayjs.Dayjs) => {
      setPeriodStart(
        date.date() < userStartDay
          ? date.clone().subtract(1, "month").date(userStartDay).startOf("date")
          : date.clone().date(userStartDay).startOf("date"),
      );
      setPeriodEnd(
        date.date() < userStartDay
          ? date.clone().date(userStartDay).subtract(1, "day").startOf("date")
          : date
              .clone()
              .add(1, "month")
              .date(userStartDay)
              .subtract(1, "day")
              .startOf("date"),
      );
    },
    [userStartDay],
  );

  useEffect(() => {
    setPeriod(dayjs());
  }, [setPeriod, userStartDay]);
  return (
    <ThemeProvider attribute="class">
      <PeriodContext.Provider
        value={{
          userStartDay: userStartDay,
          nextPeriod: () => {
            setPeriodStart((o) => o.add(1, "month"));
            setPeriodEnd((o) => o.add(1, "month"));
          },
          previousPeriod: () => {
            setPeriodStart((o) => o.subtract(1, "month"));
            setPeriodEnd((o) => o.subtract(1, "month"));
          },
          setPeriod,
          periodStart,
          periodEnd,
        }}
      >
        <Toaster />
        <Layout>{children}</Layout>
      </PeriodContext.Provider>
    </ThemeProvider>
  );
};

const MyApp: AppType = ({ Component, pageProps }) => {
  // const [queryDate, setQueryDate] = useState(dayjs().set("date", 23));

  return (
    <ClerkProvider {...pageProps}>
      <WithClerk>
        <Component {...pageProps} />
      </WithClerk>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
