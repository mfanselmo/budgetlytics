"use client";
import React, { useContext } from "react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "./ui/button";

import { PeriodContext } from "~/context/period";

import { api } from "~/utils/api";

const NewMonthButton = () => {
  const ctx = api.useContext();

  const period = useContext(PeriodContext);
  const { toast } = useToast();

  const { mutate: generateNewPeriodTimedCategories, isLoading: isCreating } =
    api.timedCategory.generateNewPeriodTimedCategories.useMutation({
      onSuccess: async () => {
        await ctx.timedCategory.getAllInPeriodWithTransactions.invalidate(
          {
            startDate: period.periodStart.toDate(),
            endDate: period.periodEnd.toDate(),
          },
          {
            type: "all",
          },
        );
      },
      onError: (e) => {
        toast({
          variant: "destructive",
          title: e.data?.code || "Error",
          description: e.data?.message || "Unknown error",
        });
      },
    });

  return (
    <Button
      size={"sm"}
      loading={isCreating}
      onClick={() =>
        generateNewPeriodTimedCategories({
          startDate: period.periodStart.toDate(),
          endDate: period.periodEnd.toDate(),
        })
      }
    >
      Create this months categories
    </Button>
  );
};

export default NewMonthButton;
