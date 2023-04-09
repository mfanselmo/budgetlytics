import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import dayjs from 'dayjs'


export const categoryRouter = createTRPCRouter({
  create: privateProcedure
  .input(
    z.object({
      name: z.string().min(1).max(280),
      budget: z.number().positive()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId;

    const category = await ctx.prisma.category.create({
      data: {
        userId,
        name: input.name,
        budget: input.budget,
        timedCategories: {
          create: {
            userId,
            name: input.name,
            budget: input.budget,
            startDate: dayjs().startOf('month').toDate(),
            endDate: dayjs().endOf('month').toDate(),
          }
        }
      },
    });

    return category;
  }),
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        userId: ctx.userId
      }
    });
  }),
});
