import withNextApollo from "next-with-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import getConfig from "next/config";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";

import { refreshLink } from "@/app/lib/token_refresh_link";
import { getAuth } from "@/app/lib/auth";

const { publicRuntimeConfig } = getConfig();

const httpLink = new HttpLink({
  uri: publicRuntimeConfig.GRAPH_API_URL,
  credentials: "include",
  fetch,
});

const authLink = setContext((_request, { headers }) => {
  const token = getAuth();
  return {
    headers: {
      ...headers,
      authorization: token.accessToken?.authorizationString,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.error("apollo next error");
  console.error({ graphQLErrors, networkError });
});

export const withApollo = withNextApollo(
  ({ initialState }) =>
    new ApolloClient({
      ssrMode: true,
      link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
      cache: new InMemoryCache().restore(initialState || {}),
    })
);
