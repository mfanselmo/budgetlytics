import { type NextPage } from "next";
import { Button } from "~/components/ui/button";

import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { Label } from "~/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";

const Settings: NextPage = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [showChangePeriodStartDayForm, setShowChangePeriodStartDayForm] =
    useState(false);
  const { user } = useUser();
  const { data } = api.settings.getPeriodStartDay.useQuery(
    {},
    {
      enabled: !!user,
    },
  );

  const { mutate: changePeriodStartDay, isLoading: isChangingPeriodStartDay } =
    api.settings.setPeriodStartDay.useMutation({
      onSuccess: () => {
        setShowChangePeriodStartDayForm(false);
        router.reload();
      },
    });
  const formSchema = z.object({
    periodStartDay: z.number().min(1, "Must be between 1 and 28").max(28),
  });
  type FormSchemaType = z.infer<typeof formSchema>;

  const userStartDay = data?.day ?? 1;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      periodStartDay: userStartDay,
    },
  });

  const createToken = async () => {
    const token = await getToken({ template: "Budgety" });
    setToken(token);
  };

  return (
    <>
      <h2>Settings</h2>
      <div className="mt-4">
        {/* API TOKEN SECTION */}
        <div className="mb-8">
          <h4 className="mb-2">Integrations</h4>
          <article className="prose prose-neutral dark:prose-invert">
            <p>
              Generate an API token to use Budgety with other services. You can
              use this token to authenticate your requests to the Budgety API.
              In the top-left menu you can see the API documentation.
            </p>
            <p>
              We provide examples for integration with Scriptable (
              <a
                href="https://scriptable.app/"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://scriptable.app/
              </a>
              ) with a full example on script that allows you to create a
              transaction in a chosen category from an iOS menu. We also provide
              snippets for the various steps needed to be done to use with
              Shortcuts in iOS.
            </p>
            <p>
              The scripts are available{" "}
              <a
                href="https://github.com/mfanselmo/budgetlytics/tree/main/scriptable"
                rel="noopener noreferrer"
                target="_blank"
              >
                here
              </a>{" "}
              you will need to add your API key in the script.
            </p>
          </article>

          <div className="flex mt-2">
            {!token ? (
              <Button onClick={createToken}>Generate API token</Button>
            ) : (
              <>
                <label htmlFor="api-token" className="sr-only">
                  Label
                </label>
                <Input
                  id="api-token"
                  type="text"
                  className="overflow-elipsis"
                  value={token || ""}
                  readOnly
                />
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    navigator.clipboard.writeText(token || "");
                  }}
                >
                  Copy
                </Button>
              </>
            )}
          </div>
        </div>
        {/* USER START DATE SECTION */}
        <div className=" mb-8">
          <h4 className="mb-2">Period start day</h4>
          <article className="prose prose-neutral dark:prose-invert">
            <p>
              Current period start day:{" "}
              <span className="bold">{userStartDay}</span> of each month. Your
              old data will not be delete after chaning the start day of your
              periods but:
            </p>
            <ul className="list-disc">
              <li>
                New categories will have to be generated for the new periods,
                with <strong>no</strong> transactions
              </li>
              <li>
                Soon: You will be able to see old data in a special section of
                the app
              </li>
            </ul>
          </article>
          {!showChangePeriodStartDayForm ? (
            <Button
              className="mt-4 "
              variant={"destructive"}
              onClick={() => setShowChangePeriodStartDayForm(true)}
            >
              Edit period start day
            </Button>
          ) : (
            <form
              onSubmit={handleSubmit((val) => changePeriodStartDay(val))}
              className="flex items-end mt-4 space-x-2"
            >
              <Label label={"Period start day"}>
                <Input
                  min={1}
                  max={28}
                  type="number"
                  error={!!errors.periodStartDay}
                  errorText={errors.periodStartDay?.message}
                  {...register("periodStartDay", { valueAsNumber: true })}
                />
              </Label>
              <Button type="submit" loading={isChangingPeriodStartDay}>
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
