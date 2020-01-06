import { useState } from "react";

import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";
import { useLoginMutation, useLogoutMutation, useRevokeRefreshTokensForUserMutation } from "@/generated/graphql";
import { LoginFormData } from "@/app/components/forms/login_form";

export type AuthType = {
  login(data: LoginFormData): Promise<void>;
  logout(): Promise<void>;
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  setAuth({ jit, jid }: { jit: string; jid: string }): void;
};

export const useAuth = (): AuthType | any => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();

  const [loginMutation] = useLoginMutation();
  const [logoutMutation, { client }] = useLogoutMutation();
  const [revokeTokenMutation] = useRevokeRefreshTokensForUserMutation();

  const login = async (data: LoginFormData) => {
    const response = await loginMutation({ variables: { data } });
    if (response.data) {
      setAccessToken(response.data.login.accessToken);
    }
  };

  const revokeTokens = async (userId: string) => {
    await revokeTokenMutation({ variables: { userId } });
    await logout();
  };

  const logout = async () => {
    await logoutMutation();
    await client!.resetStore();
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
