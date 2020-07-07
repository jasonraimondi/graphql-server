import { css } from "emotion";
import * as React from "react";
import { FunctionComponent } from "react";

import { AuthType } from "@/app/lib/auth/use_auth";

type Prop = {};

export const Token: FunctionComponent<Prop> = ({ accessToken, refreshToken }) => {
  const getTokenExp = (token: string) => {
    return token.substr(0, 4) + "..." + token.substr(token.length - 4, 4);
  };

  function getExpInSeconds(expires: number) {
    return (expires - Date.now()) / 1000 + " seconds";
  }

  return (
    <div
      className={css`
        font-size: 14px;
      `}
    >
      <div
        className={css`
          background-color: ${accessToken.isExpired ? "tomato" : "lightseagreen"};
        `}
      >
        <p>accessToken: {getTokenExp(accessToken.token)}</p>
        <p>isExpired: {accessToken.isExpired.toString()}</p>
        {accessToken.isExpired ? null : (
          <>
            <p>Expires At: {accessToken.expiresAt.toLocaleString()}</p>
            <p>Expires At: {accessToken.expiresAt.getTime()}</p>
            <p>Expires In: {getExpInSeconds(accessToken.expiresAt.getTime())}</p>
          </>
        )}
      </div>

      <div
        className={css`
          background-color: ${refreshToken.isExpired ? "tomato" : "lightseagreen"};
        `}
      >
        <p>refreshToken: {getTokenExp(refreshToken.token)}</p>
        {refreshToken.isExpired ? null : (
          <>
            <p>Expires At: {refreshToken.expiresAt.toLocaleString()}</p>
            <p>Expires At: {refreshToken.expiresAt.getTime()}</p>
            <p>Expires In: {getExpInSeconds(refreshToken.expiresAt.getTime())}</p>
          </>
        )}
        <p>isExpired: {refreshToken.isExpired.toString()}</p>
      </div>
    </div>
  );
};
