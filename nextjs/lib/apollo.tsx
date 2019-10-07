// @ts-ignore
import { withData } from 'next-apollo'
import { getAccessToken, setAccessToken } from "./access_token";
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-boost';
import fetch from "isomorphic-unfetch";
import jwtDecode from "jwt-decode";
//
const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
    fetch
});

const refreshLink = new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: () => {
        const token = getAccessToken();
        console.log("isTokenValidOrUndefined", {token});

        if (!token) {
            return true;
        }

        try {
            const { exp } = jwtDecode(token);
            if (Date.now() >= exp * 1000) {
                return false;
            } else {
                return true;
            }
        } catch {
            return false;
        }
    },
    fetchAccessToken: () => {
        console.log("fetch access token");
        return fetch("http://localhost:4000/refresh_token", {
            method: "POST",
            credentials: "include"
        });
    },
    handleFetch: accessToken => {
        console.log("handleFetch", { accessToken });
        setAccessToken(accessToken);
    },
    handleError: err => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
    }
});

const authLink = setContext((_request, { headers }) => {
    // const token = isServer() ? serverAccessToken : getAccessToken();
    const token = getAccessToken();
    console.log("setContext", {token});
    return {
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : ""
        }
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log({graphQLErrors});
    console.log({networkError});
});


// can also be a function that accepts a `context` object (SSR only) and returns a config
const config = {
    link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
};

console.log("withApollo");
export const withApollo = withData(config);
