"use client";

import { Session } from "next-auth";
import { SessionProvider as Provider } from "next-auth/react";
import React from "react";

function SessionProvider({ children, session }) {
  return <Provider session={session}>{children}</Provider>;
}

export default SessionProvider;
