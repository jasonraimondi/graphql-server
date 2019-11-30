import React from "react";

import {
    destroyAccessToken,
    getAuth,
    redirectToLogin,
    setAccessToken,
} from "@/app/lib/auth";
import { NextPage, NextPageContext } from "next";
import { fetchAccessToken } from "@/app/lib/token_refresh_link";

export const COOKIES = {
    accessToken: "jid",
};

type Props = {
    accessToken?: string;
};

type RefreshTokenResponse = {
    success: boolean;
    accessToken: string;
};

export function privateRoute(WrappedComponent: NextPage<any>) {
    const AuthenticatedRoute: NextPage<Props> = (props: Props) => {
        return <WrappedComponent {...props} />;
    };

    AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext) => {
        const { accessToken, refreshToken } = await getAuth(ctx);

        if (accessToken.isExpired) {
            destroyAccessToken(ctx);

            if (!refreshToken || refreshToken.token === "") {
                await redirectToLogin(ctx);
                return {};
            }

            const data = await fetchAccessToken();
            const tokenResponse: RefreshTokenResponse = await data.json();

            if (!tokenResponse.success) {
                await redirectToLogin(ctx);
            }

            setAccessToken(tokenResponse.accessToken, ctx);
        }

        // Check if Page has a `getInitialProps`; if so, call it.
        const pageProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx));

        // Return props.
        return { ...pageProps };
    };

    return AuthenticatedRoute;
}
