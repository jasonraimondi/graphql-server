import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";

import baseStyles from "@/styles/base";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <React.StrictMode>
        <Html>
          <Head/>
          {baseStyles}
          <body>
          <Main/>
          <NextScript/>
          </body>
        </Html>
      </React.StrictMode>
    );
  }
}

export default MyDocument;
