"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Show the Navbar 

export default function Page({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await fetch("/api/auth/session");
      const sessionDataJSON = await sessionData.json();
      setSession(sessionDataJSON);
    }

    fetchSession();
  }, []);

  return (
    <html lang="en">
      <body>
        <Navbar session={session} />
        {children}
      </body>
    </html>
  );
}