import { TypeOf, z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import dayjs, { type Dayjs } from 'dayjs'
import { Months, MonthsEnum } from "~/helpers/date";

export const timedCategoryRouter = createTRPCRouter({
  //   create: privateProcedure
  //   .input(
  //     z.object({
  //       name: z.string().min(1).max(280),
  //       budget: z.number().positive()
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const userId = ctx.userId;

  //     const category = await ctx.prisma.category.create({
  //       data: {
  //         userId,
  //         name: input.name,
  //         budget: input.budget,
  //         timedCategories: {
  //           create: {
  //             userId,
  //             budget: input.budget,
  //             startDate: dayjs().startOf('month').toDate(),
  //             endDate: dayjs().endOf('month').toDate()
  //           }
  //         }
  //       },
  //     });

  //     return category;
  //   }),
  // getAll: privateProcedure.query(({ ctx }) => {
  //   return ctx.prisma.category.findMany({
  //     where: {
  //       userId: ctx.userId
  //     }
  //   });
  // }),
  generateNewMonthTimedCategories: privateProcedure
  .input(z.object({
    month: z.number().int().min(0).max(11).default(dayjs().month()),
    year: z.number().int().min(1960).max(2055).default(dayjs().year()),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId;
    const date = dayjs().set('month', input.month).set('year', input.year)

    const userCategories = await ctx.prisma.category.findMany({
      where: {
        userId
      }
    })


    const promises = userCategories.map(cat => {
      return ctx.prisma.timedCategory.create({
        data: {
          userId,
          name: cat.name,
          budget: cat.budget,
          categoryId: cat.id,
          startDate: date.startOf('month').toDate(),
          endDate: date.endOf('month').toDate(),
        }
      })
    });

    return Promise.all(promises)

  }),
  getById: privateProcedure
    .input(z.object({
      id: z.string().cuid()
    }))  
    .query(({ ctx, input }) => {
      return ctx.prisma.timedCategory.findFirstOrThrow({
        where: {
          userId: ctx.userId,
          id: input.id
        },
        include: {
          transactions: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    }),
  getAllInPeriod: privateProcedure
    .input(z.object({
      month: z.number().int().min(0).max(11).default(dayjs().month()),
      year: z.number().int().min(1960).max(2055).default(dayjs().year()),
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.timedCategory.findMany({
        where: {
          userId: ctx.userId,
          startDate: {
            lte: dayjs().set('month', input.month).set('year', input.year).toDate()
          },
          endDate: {
            gte: dayjs().set('month', input.month).set('year', input.year).toDate()
          }
        },
      });
    }),
  getAllInPeriodWithTransactions: privateProcedure
    .input(z.object({
      month: z.number().int().min(0).max(11).default(dayjs().month()),
      year: z.number().int().min(1960).max(2055).default(dayjs().year()),
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.timedCategory.findMany({
        where: {
          userId: ctx.userId,
          startDate: {
            lte: dayjs().set('month', input.month).set('year', input.year).toDate()
          },
          endDate: {
            gte: dayjs().set('month', input.month).set('year', input.year).toDate()
          }
        },
        include: {
          transactions: true
        }
      });
    }),
});
