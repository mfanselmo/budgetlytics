import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { CURRENCIES } from "~/helpers/currency";

export const categoryRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(280),
        budget: z.number().nonnegative(),
        currency: z.enum(CURRENCIES),
        newTimedCategoryData: z
          .object({
            startDate: z.date(),
            endDate: z.date(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const userSettings = await ctx.prisma.settings.findFirst({
        where: {
          userId,
        },
      });

      if (!userSettings) throw Error("User settings not found");

      const category = await ctx.prisma.category.create({
        data: {
          userId,
          name: input.name,
          budget: input.budget,
          currency: input.currency,
          timedCategories: input.newTimedCategoryData && {
            create: {
              userId,
              name: input.name,
              budget: input.budget,
              currency: input.currency,
              // Automatically create a timed category for the current period
              startDate: input.newTimedCategoryData.startDate,
              endDate: input.newTimedCategoryData.endDate,
            },
          },
        },
      });

      return category;
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getById: privateProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findFirstOrThrow({
        where: {
          userId: ctx.userId,
          id: input.id,
        },
        include: {
          timedCategories: true,
        },
      });
    }),
  getAll: privateProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/category",
        summary: "Get all categories",
        tags: ["category"],
      },
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.string().cuid(),
          name: z.string(),
          budget: z.number(),
          currency: z.enum(CURRENCIES),
        }),
      ),
    )
    .query(({ ctx }) => {
      return ctx.prisma.category.findMany({
        where: {
          userId: ctx.userId,
        },
      });
    }),
});
