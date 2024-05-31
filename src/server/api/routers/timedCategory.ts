import { z } from "zod";
import { CURRENCIES } from "~/helpers/currency";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const timedCategoryRouter = createTRPCRouter({
  generateNewPeriodTimedCategories: privateProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const userCategories = await ctx.prisma.category.findMany({
        where: {
          userId,
        },
      });

      const userSettings = await ctx.prisma.settings.findFirst({
        where: {
          userId,
        },
      });
      if (!userSettings) throw Error("User settings not found");

      const promises = userCategories.map((cat) => {
        return ctx.prisma.timedCategory.create({
          data: {
            userId,
            name: cat.name,
            budget: cat.budget,
            categoryId: cat.id,
            currency: cat.currency,
            startDate: input.startDate,
            endDate: input.endDate,
          },
        });
      });

      return Promise.all(promises);
    }),
  getById: privateProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.timedCategory.findFirstOrThrow({
        where: {
          userId: ctx.userId,
          id: input.id,
        },
        include: {
          transactions: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.timedCategory.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAllInPeriod: privateProcedure
    .meta({
      openapi: {
        summary: "Get all timed categories in a period",
        tags: ["category"],
        method: "GET",
        path: "/category/getAllInPeriod",
      },
    })
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .output(
      z.array(
        z.object({
          id: z.string().cuid(),
          createdAt: z.date(),
          updatedAt: z.date(),
          startDate: z.date(),
          endDate: z.date(),
          budget: z.number(),
          name: z.string(),
          currentAmount: z.number(),
          currency: z.enum(CURRENCIES),
          categoryId: z.string().nullable(),
        }),
      ),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.timedCategory.findMany({
        where: {
          userId: ctx.userId,
          startDate: {
            lte: input.startDate,
          },
          endDate: {
            gte: input.endDate,
          },
        },
      });
    }),
  getAllInPeriodWithTransactions: privateProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.timedCategory.findMany({
        where: {
          userId: ctx.userId,
          startDate: {
            lte: input.startDate,
          },
          endDate: {
            gte: input.endDate,
          },
        },
        include: {
          transactions: true,
        },
      });
    }),
});
