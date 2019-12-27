import { useState, useEffect, SetStateAction } from "react";

import { AuthTokens, getInMemoryTokens } from "@/app/lib/auth/in_memory";
import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";
import { setRefreshToken } from "@/app/lib/auth/in_memory_refresh_token";

type AuthType = {
  auth: AuthTokens;
  setAuth: (auth: SetStateAction<AuthTokens>) => void;
};

export const useAuth = ({ jit = "", jid = "" }): AuthType => {
  setAccessToken(jit);
  setRefreshToken(jid);

  const [auth, setAuth] = useState(getInMemoryTokens());

  useEffect(() => {
    console.log("use auth has mounted", jid !== "", jid);
    setRefreshToken(jid);
    setAuth(getInMemoryTokens());
    console.log("i am auth", auth);
  }, [`${jit}${jid}`]);

  return { auth, setAuth };
};
