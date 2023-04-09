import { z } from "zod";
import { type NextPage } from "next";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/hooks/use-toast"


import { api } from "~/utils/api";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/router";
import dayjs from 'dayjs'
import { useContext } from "react";
import { PeriodContext } from "~/context/period";
// import Select from 'react-select'
import Select from '~/components/ui/select'

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(280),
    date: z.date(),
    timedCategoryId: z.string().cuid(),
    amount: z.number()
  })

type FormSchemaType = z.infer<typeof formSchema>;

const NewTransaction: NextPage = () => {

  const period = useContext(PeriodContext)
  const { toast } = useToast()
  const ctx = api.useContext();
  const router = useRouter()

  const { data: timedCategories, isLoading: timedCategoriesLoading } = api.timedCategory.getAllInPeriod.useQuery({
    month: period.date.month(),
    year: period.date.year(),
    includeTransactions: true
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timedCategoryId: router.query.timedCategoryId as (string | undefined)
    }
  });



  const { mutate, isLoading: isCreating } = api.transaction.create.useMutation({
    // onSuccess: async () => {
    //   await ctx.transaction.getAll.invalidate(undefined, {
    //     type: "all"
    //   });
    //   return router.push('/category')
    // },
    onError: (e) => {
      toast({
        variant: 'destructive',
        title: e.data?.code || "Error",
        description: e.data?.message || "Unknown error"
      })
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = data => void mutate(data);

  return (
    <>
      <h2 className="mb-4">New Transaction</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">

        <Label label={'Category'}>

          <Select
            name="timedCategoryId"
            control={control}
            isLoading={timedCategoriesLoading}
            options={timedCategories}
            labelName={'name'}
            valueName={'id'}
            error={!!errors.timedCategoryId}
            errorText={errors.timedCategoryId?.message}
          />
        </Label>
        <Label label={'Name'}>
          <Input autoComplete={"off"} {...register("name")} error={!!errors.name} errorText={errors.name?.message} placeholder="Food" />
        </Label>
        <Label label={'amount'}>
          <Input type="number" error={!!errors.amount} errorText={errors.amount?.message} {...register("amount", { valueAsNumber: true })} placeholder="5" />
        </Label>
        <Label label={'Date'}>
          <Input type="date" autoComplete={"off"} defaultValue={new Date().toISOString().slice(0, 10)} {...register("date", { valueAsDate: true })} error={!!errors.date} errorText={errors.date?.message} />
        </Label>


        <Button className="w-full" type="submit" loading={isCreating}>Create</Button>

      </form >
    </>
  );
};

export default NewTransaction;
