import { useState, useEffect } from "react";

import { Auth, getInMemoryTokens } from "@/app/lib/auth";
import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";
import { setRefreshToken } from "@/app/lib/auth/in_memory_refresh_token";

export const useAuth = ({ jit = "", jid = "" }): Auth => {
  setAccessToken(jit);
  setRefreshToken(jid);

  const [auth, setAuth] = useState(getInMemoryTokens());

  useEffect(() => {
    console.log("use auth has mounted", jid !== "", jid);
    // setRefreshToken(jid);
    setAuth(getInMemoryTokens());
    console.log("i am auth", auth);
  }, []);

  return auth;
};
