import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import dayjs from "dayjs";
import { CURRENCIES } from "~/helpers/currency";

export const categoryRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(280),
        budget: z.number().positive(),
        currency: z.enum(CURRENCIES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const category = await ctx.prisma.category.create({
        data: {
          userId,
          name: input.name,
          budget: input.budget,
          currency: input.currency,
          timedCategories: {
            create: {
              userId,
              name: input.name,
              budget: input.budget,
              currency: input.currency,
              startDate: dayjs().startOf("month").toDate(),
              endDate: dayjs().endOf("month").toDate(),
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
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        userId: ctx.userId,
      },
    });
  }),
});
