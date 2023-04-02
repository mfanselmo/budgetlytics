import { SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";

// import { api } from "~/utils/api";

const NewCategory: NextPage = () => {
  return (
    <>
    <SignOutButton />
    New category
    </>
  );
};

export default NewCategory;
