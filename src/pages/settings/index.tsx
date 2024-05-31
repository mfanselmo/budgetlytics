import { type NextPage } from "next";
import { Button } from "~/components/ui/button";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

const Settings: NextPage = () => {
  const { getToken } = useAuth();

  const [token, setToken] = useState<string | null>(null);

  const createToken = async () => {
    const token = await getToken({ template: "Budgety" });
    setToken(token);
  };

  return (
    <>
      <h2>Settings</h2>
      <Button onClick={createToken}>Create token</Button>

      {token && <span className="text-wrap	">{token}</span>}
    </>
  );
};

export default Settings;
