import Router from "next/router";
import { NextPageContext } from "next";

export const Redirect = (target: string, context?: NextPageContext) => {
  if (context?.res) {
    // server
    // 303: "See other"
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.push(target);
  }
};

export const redirectToLogin = async (ctx?: NextPageContext, doNotRedirectBack = false) => {
  let redirectLink = ctx?.pathname ?? document.referrer;

  if (redirectLink) {
    redirectLink = `?redirectTo=${encodeURI(redirectLink)}`;
  }

  if (doNotRedirectBack) {
    redirectLink = "";
  }

  await Redirect(`/login${redirectLink}`, ctx);
};
