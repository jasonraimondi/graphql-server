import React from "react";
import App from "next/app";
import { ApolloClient } from "apollo-boost";
import { withApollo } from "@/app/lib/apollo_next";
import { ApolloProvider } from "@apollo/react-hooks";

interface Props {
  apollo: ApolloClient<{}>;
}

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
