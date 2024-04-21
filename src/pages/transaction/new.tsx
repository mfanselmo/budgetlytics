import { z } from "zod";
import { type NextPage } from "next";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/hooks/use-toast";

import { api } from "~/utils/api";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PeriodContext } from "~/context/period";
import Select from "~/components/ui/select";
import PeriodChange from "~/components/period-change";
import { CURRENCIES } from "~/helpers/currency";
import dayjs from "dayjs";

const NewTransaction: NextPage = () => {
  const period = useContext(PeriodContext);
  const { toast } = useToast();
  const router = useRouter();

  console.log(period.periodStart.toDate());
  console.log(period.periodEnd.toDate());

  const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(280),
    date: z
      .date()
      .min(
        period.periodStart.subtract(1, "day").toDate(),
        "Must be inside of selected period",
      )
      .max(period.periodEnd.toDate(), "Must be inside of selected period"),
    timedCategoryId: z.string().cuid(),
    currency: z.enum(CURRENCIES),
    amount: z.number(),
  });

  type FormSchemaType = z.infer<typeof formSchema>;

  const { data: timedCategories, isLoading: timedCategoriesLoading } =
    api.timedCategory.getAllInPeriod.useQuery({
      startDate: period.periodStart.toDate(),
      endDate: period.periodEnd.toDate(),
    });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timedCategoryId: router.query.timedCategoryId as string | undefined,
    },
  });

  // Only run on initial load
  useEffect(() => {
    if (timedCategories) {
      const urlTimedCategory = timedCategories.find(
        (t) => t.id === router.query.timedCategoryId,
      );
      if (urlTimedCategory) {
        setValue("timedCategoryId", urlTimedCategory.id, {
          shouldValidate: true,
        });
        setValue("currency", urlTimedCategory.currency, {
          shouldValidate: true,
        });
      } else {
        setValue("timedCategoryId", undefined as unknown as string, {
          shouldValidate: true,
        });
      }
    }
  }, [router.query.timedCategoryId, setValue, timedCategories]);

  const { mutate, isLoading: isCreating } = api.transaction.create.useMutation({
    // onSuccess: async () => {
    //   await ctx.transaction.getAll.invalidate(undefined, {
    //     type: "all"
    //   });
    //   return router.push('/category')
    // },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: e.data?.code || "Error",
        description: e.data?.message || "Unknown error",
      });
    },
  });

  const setCurrency = (timedCategoryId: string) => {
    const timedCategory = timedCategories?.find(
      (t) => t.id === timedCategoryId,
    );
    if (!timedCategory) return;
    setValue("currency", timedCategory.currency, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    // take from the form date only the date, month and year. Apply the current time to that date
    const dateInformation = dayjs(data.date);
    console.log(dateInformation.get("date"));
    void mutate({
      ...data,
      date: dayjs()
        .set("year", dateInformation.get("year"))
        .set("month", dateInformation.get("month"))
        .set("date", dateInformation.get("date") + 1)
        .toDate(),
    });
  };

  return (
    <>
      <h2 className="mb-1">New Transaction</h2>
      <div className="flex justify-between items-center mb-4">
        Period {period.periodStart.format("DD MMMM YYYY")} -{" "}
        {period.periodEnd.format("DD MMMM YYYY")}
        <PeriodChange />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm mx-auto"
      >
        <Label label={"Category"}>
          <Select
            onSelect={setCurrency}
            name="timedCategoryId"
            control={control}
            isLoading={timedCategoriesLoading}
            options={timedCategories}
            labelName={"name"}
            valueName={"id"}
            error={!!errors.timedCategoryId}
            errorText={errors.timedCategoryId?.message}
          />
        </Label>
        <Label label={"Name"}>
          <Input
            autoComplete={"off"}
            {...register("name")}
            error={!!errors.name}
            errorText={errors.name?.message}
            placeholder="Food"
          />
        </Label>
        <Label label={"amount"}>
          <Input
            type="number"
            error={!!errors.amount}
            errorText={errors.amount?.message}
            {...register("amount", { valueAsNumber: true })}
            placeholder="5"
          />
        </Label>
        <Label label={"Date"}>
          <Input
            type="date"
            autoComplete={"off"}
            defaultValue={new Date().toISOString().slice(0, 10)}
            {...register("date", { valueAsDate: true })}
            error={!!errors.date}
            errorText={errors.date?.message}
          />
        </Label>

        <Button className="w-full" type="submit" loading={isCreating}>
          Create
        </Button>
      </form>
    </>
  );
};

export default NewTransaction;
