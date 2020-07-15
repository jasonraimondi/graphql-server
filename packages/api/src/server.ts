process.env.TZ = "America/Denver";

import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { createConnection } from "typeorm";
import OAuth2Server, { Request, Response } from "oauth2-server";

import { ENV } from "@/lib/constants/config";
import { initializeApolloServer } from "@/apollo";
import { ServiceFactory } from "@/lib/services/service_factory";
import { RepositoryFactory } from "@/lib/repository/repository_factory";
import { Container } from "@/lib/inversify_container";
import { application } from "@/lib/express";

(async () => {
  if (ENV.enableDebugging) {
    console.log("DEBUGGING ENABLED");
  }

  const oauth = new OAuth2Server({
    model: require("./model"),
  });

  await import("@/controllers/oauth_controller");

  const repositoryFactory = new RepositoryFactory(await createConnection());
  const serviceFactory = new ServiceFactory(ENV.mailerURL);
  const container = new Container(repositoryFactory, serviceFactory);
  const app = await application(container);
  const apolloServer = await initializeApolloServer(container);

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => "server started on localhost:4000");
})().catch(e => console.error(e));


//
//
// let request = new Request({
//   method: "GET",
//   query: {},
//   headers: { Authorization: "Bearer foobar" },
// });
//
// let response = new Response({
//   headers: {},
// });
//
// oauth.authenticate(request, response)
//   .then((token) => {
//     // The request was successfully authenticated.
//   })
//   .catch((err) => {
//     // The request failed authentication.
//   });