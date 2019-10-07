import React from "react";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file
class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
