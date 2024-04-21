import { createTRPCRouter } from "~/server/api/trpc";
import { categoryRouter } from "~/server/api/routers/category";
import { timedCategoryRouter } from "~/server/api/routers/timedCategory";
import { transactionRouter } from "~/server/api/routers/transaction";
import { settingsRouter } from "./routers/settings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  timedCategory: timedCategoryRouter,
  transaction: transactionRouter,
  settings: settingsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
