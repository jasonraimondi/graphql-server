import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { Global } from "@emotion/core";
import { baseStyles } from "@/styles/base";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <Global styles={baseStyles} />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
