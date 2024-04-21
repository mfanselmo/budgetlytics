import { z } from "zod";
import { type NextPage } from "next";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/hooks/use-toast";
import Select from "~/components/ui/select";

import { api } from "~/utils/api";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/router";
import { useContext } from "react";
import { PeriodContext } from "~/context/period";
import { CURRENCIES } from "~/helpers/currency";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(280),
  budget: z.number().nonnegative(),
  currency: z.enum(CURRENCIES),
});

type FormSchemaType = z.infer<typeof formSchema>;

const NewCategory: NextPage = () => {
  const { toast } = useToast();
  const period = useContext(PeriodContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const ctx = api.useContext();
  const router = useRouter();

  const { mutate, isLoading: isCreating } = api.category.create.useMutation({
    onSuccess: async () => {
      await ctx.timedCategory.getAllInPeriod.invalidate(
        {
          startDate: period.periodStart.toDate(),
          endDate: period.periodEnd.toDate(),
        },
        {
          type: "all",
        },
      );
      return router.push("/category");
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: e.data?.code || "Error",
        description: e.data?.message || "Unknown error",
      });
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) =>
    void mutate({
      ...data,
      newTimedCategoryData: {
        startDate: period.periodStart.toDate(),
        endDate: period.periodEnd.toDate(),
      },
    });

  return (
    <>
      <h2 className="mb-4">New Category</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm mx-auto"
      >
        <Label label={"Name"}>
          <Input
            autoComplete={"off"}
            {...register("name")}
            error={!!errors.name}
            errorText={errors.name?.message}
            placeholder="Food"
          />
        </Label>

        <Label label={"Budget"}>
          <Input
            type="number"
            error={!!errors.budget}
            errorText={errors.budget?.message}
            {...register("budget", { valueAsNumber: true })}
            placeholder="250"
          />
        </Label>
        <Label label={"Currency"}>
          <Select
            name="currency"
            control={control}
            options={CURRENCIES.map((currency) => ({
              id: currency,
              name: currency,
            }))}
            labelName={"name"}
            valueName={"id"}
            error={!!errors.currency}
            errorText={errors.currency?.message}
          />
        </Label>

        <Button className="w-full" type="submit" loading={isCreating}>
          Create
        </Button>
      </form>
    </>
  );
};

export default NewCategory;
