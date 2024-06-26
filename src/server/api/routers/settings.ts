import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  setPeriodStartDay: privateProcedure
    .input(
      z.object({
        periodStartDay: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.settings.updateMany({
        where: {
          userId: ctx.userId,
        },
        data: {
          periodStartDay: input.periodStartDay,
        },
      });
    }),
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
    .output(z.object({ day: z.number() }))
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

      return { day: userSettings.periodStartDay };
    }),
});
