import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  // setPeriodStartDay: privateProcedure
  //   .input(
  //     z.object({
  //       periodStartDay: z.number(),
  //     }),
  //   )
  //   .query(({ ctx, input }) => {
  //     return ctx.prisma.category.findFirstOrThrow({
  //       where: {
  //         userId: ctx.userId,
  //         id: input.id,
  //       },
  //       include: {
  //         timedCategories: true,
  //       },
  //     });
  //   }),
  getPeriodStartDay: privateProcedure
    .meta({
      openapi: {
        summary: "Get period start day",
        tags: ["settings"],
        method: "GET",
        path: "/settings/getPeriodStartDay",
      },
    })
    .input(z.object({}))
    .output(z.number())
    .query(async ({ ctx }) => {
      let userSettings = await ctx.prisma.settings.findFirst({
        where: {
          userId: ctx.userId,
        },
      });

      if (!userSettings) {
        userSettings = await ctx.prisma.settings.create({
          data: {
            userId: ctx.userId,
            periodStartDay: 1,
          },
        });
      }

      return userSettings.periodStartDay;
    }),
});
