import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { CURRENCIES } from "~/helpers/currency";

export const transactionRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(280),
        date: z.date(),
        timedCategoryId: z.string().cuid(),
        amount: z.number(),
        currency: z.enum(CURRENCIES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // const timedCategory = await ctx.prisma.timedCategory.findFirst({
      //   where: {
      //     categoryId: {
      //       equals: input.categoryId
      //     },
      //     startDate: {
      //       lte: input.date.toDate()
      //     },
      //     endDate: {
      //       gte: input.date.toDate()
      //     }
      //   }
      // })

      // if (!timedCategory) throw new TRPCError({
      //   "code": "NOT_FOUND",
      //   message: "No timed category for the selected month"
      // })

      const transaction = await ctx.prisma.transaction.create({
        data: {
          userId,
          amount: input.amount,
          name: input.name,
          createdAt: input.date,
          currency: input.currency,
          timedCategoryId: input.timedCategoryId,
        },
      });

      return transaction;
    }),
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.userId,
      },
      take: 100,
      orderBy: {
        createdAt: "asc",
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
      return ctx.prisma.transaction.findFirstOrThrow({
        where: {
          userId: ctx.userId,
          id: input.id,
        },
        include: {
          timedCategory: true,
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
      return ctx.prisma.transaction.deleteMany({
        where: {
          userId: ctx.userId,
          id: input.id,
        },
      });
    }),
});
