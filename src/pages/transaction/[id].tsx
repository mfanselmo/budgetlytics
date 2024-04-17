import {
  type GetServerSidePropsResult,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type DehydratedState } from "@tanstack/react-query";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { useContext } from "react";
import { PeriodContext } from "~/context/period";
import { TimedCategoryCard } from "~/components/timed-category-card";
import { type GetServerSidePropsContext } from "next";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";

import { getAuth } from "@clerk/nextjs/server";
import { LoadingPage } from "~/components/loading";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import NotFoundPage from "../404";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { DangerDialog } from "~/components/ui/alert-dialog";
import formatCurrency from "~/helpers/currency";

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ id: string }>,
): Promise<
  GetServerSidePropsResult<{ id: string; trpcState: DehydratedState }>
> => {
  const { userId } = getAuth(ctx.req);
  // if not userId maybe i have to redirect

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      userId,
    },
    transformer: superjson,
  });
  const id = ctx.params?.id as string;

  await helpers.transaction.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

const Transaction: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  // const period = useContext(PeriodContext)
  const router = useRouter();

  const { data, isLoading: isLoading } = api.transaction.getById.useQuery({
    id: props.id,
  });

  const { mutate: deleteTransaction, isLoading: isDeleting } =
    api.transaction.delete.useMutation({
      onSuccess: async () => {
        return router.push({
          pathname: `/timed-category/${data?.timedCategoryId || ""}`,
        });
      },
    });

  return (
    <>
      <h2>Transaction</h2>
      {isLoading && <LoadingPage />}
      {!isLoading && !data && <NotFoundPage />}
      {data && !isLoading && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{data.name}</CardTitle>
              <CardDescription>
                {dayjs(data.createdAt).format("DD/MM/YYYY")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{formatCurrency(data.amount, data.currency)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p>{data.timedCategory.name}</p>

              <DangerDialog
                loading={isDeleting}
                onClick={() => deleteTransaction({ id: data.id })}
              >
                Delete
              </DangerDialog>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Transaction;
