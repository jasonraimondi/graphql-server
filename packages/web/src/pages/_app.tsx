import React from "react";
import App from "next/app";

interface Props {
}

export default class MyApp extends App<Props> {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Component {...pageProps} />
    );
  }
}
