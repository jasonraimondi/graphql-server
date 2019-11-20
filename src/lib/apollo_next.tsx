// @ts-ignore
import { withData } from "next-apollo";
import getConfig from 'next/config'
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";

import { refreshLink } from "@/app/lib/token_refresh_link";
import { getAccessToken } from "@/app/lib/access_token";

const { publicRuntimeConfig } = getConfig();

const httpLink = new HttpLink({
  uri: publicRuntimeConfig.GRAPH_API_URL,
  credentials: "include",
  fetch
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
  console.log({graphQLErrors, networkError});
});

// can also be a function that accepts a `context` object (SSR only) and returns a config
const config = {
  link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
};

export const withApollo = withData(config);
