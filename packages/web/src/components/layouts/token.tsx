import { Auth } from "@/app/lib/auth";
import { css } from "emotion";
import * as React from "react";

export const Token = ({ accessToken, refreshToken }: Auth) => {
  return (
    <div
      className={css`
          font-size: 14px;
        `}>
      <div
        className={css`
          background-color: ${accessToken.isExpired ? "tomato" : "lightseagreen"};
        `}
      >
        <p>accessToken: {accessToken.token.substr(0, 4)}</p>
        <p>isExpired: {accessToken.isExpired.toString()}</p>
        {accessToken.isExpired ? null : (
          <>
            <p>Expires At: {accessToken.expiresAt.toString()}</p>
            <p>Expires In: {(accessToken.expiresAt.getTime() - Date.now()) / 1000} seconds</p>
          </>
        )}
      </div>

      <div
        className={css`
          background-color: ${refreshToken.isExpired ? "tomato" : "lightseagreen"};
        `}
      >
        <p>refreshToken: {refreshToken.token.substr(0, 4)}</p>
        {refreshToken.isExpired ? null : (
          <>
            <p>Expires At: {refreshToken.expiresAt.toString()}</p>
            <p>Expires In: {(refreshToken.expiresAt.getTime() - Date.now()) / 1000} seconds</p>
          </>
        )}
        <p>isExpired: {refreshToken.isExpired.toString()}</p>
      </div>
    </div>
  );
};
