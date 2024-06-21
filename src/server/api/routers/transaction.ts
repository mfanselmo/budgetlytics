import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { CURRENCIES } from "~/helpers/currency";

export const transactionRouter = createTRPCRouter({
  create: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/transaction/create",
        summary: "Create a new transaction",
        description: "Create a new transaction",
        tags: ["transaction"],
      },
    })
    .input(
      z.object({
        name: z.string().min(1).max(280),
        date: z.date(),
        timedCategoryId: z.string().cuid(),
        amount: z.number(),
        currency: z.enum(CURRENCIES),
      }),
    )
    .output(
      z.object({
        id: z.string().cuid(),
        createdAt: z.date(),
        name: z.string(),
        amount: z.number(),
        currency: z.enum(CURRENCIES),
        timedCategoryId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

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
  get: privateProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/transaction",
        summary: "GET all transactions",
        description: "Get all transactions paginated",
        tags: ["transaction"],
      },
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.string().cuid(),
          createdAt: z.date(),
          name: z.string(),
          amount: z.number(),
          currency: z.enum(CURRENCIES),
          timedCategory: z.object({
            id: z.string().cuid(),
            name: z.string(),
          }),
        }),
      ),
    )
    .query(({ ctx }) => {
      return ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.userId,
        },
        select: {
          id: true,
          createdAt: true,
          name: true,
          amount: true,
          currency: true,
          timedCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: 20,
        orderBy: {
          createdAt: "desc",
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
