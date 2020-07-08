import { useState } from "react";

import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";
import { LoginFormData } from "@/app/components/forms/login_form";
import { apiSDK } from "@/app/lib/api_sdk";

export type AuthType = {
  login(data: LoginFormData): Promise<void>;
  logout(): Promise<void>;
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  setAuth({ jit, jid }: { jit: string; jid: string }): void;
};

export const useAuth = (): AuthType | any => {
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();

  // const [loginMutation] = useLoginMutation();
  // const [logoutMutation, { client }] = useLogoutMutation();
  // const [revokeTokenMutation] = useRevokeRefreshTokensForUserMutation();

  const login = async (data: LoginFormData) => {
    const response = await apiSDK.Login({ data })
    if (response.data) {
      console.log(response);
      setAccessToken(response.data.login.accessToken);
    }
  };

  const revokeTokens = async (userId: string) => {
    await apiSDK.RevokeRefreshTokensForUser({ userId });
    await logout();
  };

  const logout = async () => {
    await apiSDK.Logout();
    setAccessToken("");
    setRefreshToken("");
  };

  const setAuth = ({ jit, jid }: { jit: string; jid: string }) => {
    console.log("set auth", jit, jid);
    setAccessToken(jit);
    setRefreshToken(jid);
  };

  return {
    login,
    logout,
    revokeTokens,
    setAuth,
    accessToken: new AccessToken(accessToken),
    refreshToken: new RefreshToken(refreshToken),
  };
};
