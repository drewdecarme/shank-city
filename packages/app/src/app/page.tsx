"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useUser();
  const [res, setRes] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function getTest() {
      try {
        const res = await fetch("/api/test");
        const text = await res.json();
        setRes(text);
      } catch (error) {}
    }
    getTest();
  }, []);
  return (
    <div>
      {user && (
        <a className="button__logout" href="/api/auth/logout">
          Log Out
        </a>
      )}
      <br />
      Logged In: {!user ? "No" : <pre>{JSON.stringify(user, null, 2)}</pre>}
      <h5>Response:</h5>
      <pre>{JSON.stringify(res, null, 2)}</pre>
    </div>
  );
}
