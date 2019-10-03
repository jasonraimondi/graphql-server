// @ts-ignore
import { withData } from "next-apollo";
import { HttpLink, ApolloLink, Observable } from "apollo-boost";
import { onError } from "apollo-link-error";
import jwtDecode from "jwt-decode";
import { TokenRefreshLink } from "apollo-link-token-refresh";

import { getAccessToken, setAccessToken } from "./access_token";


const requestLink = new ApolloLink(
    (operation, forward) =>
        new Observable(observer => {
            let handle: any;
            Promise.resolve(operation)
                .then(operation => {
                    const accessToken = getAccessToken();
                    if (accessToken) {
                        operation.setContext({
                            headers: {
                                authorization: `bearer ${accessToken}`
                            }
                        });
                    }
                })
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer)
                    });
                })
                .catch(observer.error.bind(observer));

            return () => {
                if (handle) handle.unsubscribe();
            };
        })
);

const config = {
    link: ApolloLink.from([
        new TokenRefreshLink({
            accessTokenField: "accessToken",
            isTokenValidOrUndefined: () => {
                console.log("is token valid function");
                const token = getAccessToken();
                console.log({token});
                if (!token) {
                    console.log("no token");
                    return true;
                }

                try {
                    const { exp } = jwtDecode(token);
                    const isValid = Date.now() < exp * 1000;
                    console.log({exp, isValid});
                    return isValid;
                } catch {
                    return false;
                }
            },
            fetchAccessToken: () => {
                console.log("fetch access token");
                return fetch("http://localhost:4000/refresh_token", {
                    method: "POST",
                    credentials: "include"
                }).then(async res => {
                    console.log({
                        foo: await res.json()
                    });
                    return res;
                });
            },
            handleFetch: accessToken => {
                console.log({accessToken});
                setAccessToken(accessToken);
            },
            handleError: err => {
                console.warn("Your refresh token is invalid. Try to relogin");
                console.error(err);
            }
        }),
        onError(({ graphQLErrors, networkError }) => {
            console.log(graphQLErrors);
            console.log(networkError);
        }),
        requestLink,
        new HttpLink({
            uri: "http://localhost:4000/graphql",
            credentials: "include"
        })
    ])
};

export const withApollo = withData(config);
