import React from "react";
import Providers from "../providers";
import { auth } from "@/auth";

const LoggedInLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();

  return (
    <div>
      <Providers session={session}>{children}</Providers>
    </div>
  );
};

export default LoggedInLayout;
