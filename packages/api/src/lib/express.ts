import { InversifyExpressServer } from "inversify-express-utils";
import { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import { Container } from "@/lib/inversify_container";
import { ENV } from "@/lib/constants/config";

const expressMiddlewares = (app: Application) => {
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: ENV.corsURLS,
      credentials: true,
    })
  );
  app.use(cookieParser());
};

export const application = async (container: Container) => {
  const server = new InversifyExpressServer(container);
  server.setConfig(expressMiddlewares);
  return server.build();

//   app.post('/oauth/token', oauth.token());
//
//   // Get authorization.
//   app.get('/oauth/authorize', function(req, res) {
//     // Redirect anonymous users to login page.
//     // if (!req.app.locals.user) {
//     //   return res.redirect(util.format('/login?redirect=%s&client_id=%s&redirect_uri=%s', req.path, req.query.client_id, req.query.redirect_uri));
//     // }
//
//     // return render('authorize', {
//     //   client_id: req.query.client_id,
//     //   redirect_uri: req.query.redirect_uri
//     // });
//     return res.json({
//       client_id: req.query.client_id,
//       redirect_uri: req.query.redirect_uri,
//     })
//   });
//
// // Post authorization.
//   app.post('/oauth/authorize', function(req, res) {
//     // Redirect anonymous users to login page.
//     if (!req.app.locals.user) {
//     //   return res.redirect(util.format('/login?client_id=%s&redirect_uri=%s', req.query.client_id, req.query.redirect_uri));
//       return res.json("format");
//     }
//
//     return oauth.authorize();
//   });
//
// // Get login.
//   app.get('/login', function(req, res) {
//     // return render('login', {
//     //   redirect: req.query.redirect,
//     //   client_id: req.query.client_id,
//     //   redirect_uri: req.query.redirect_uri
//     // });
//     return res.json({
//       redirect: req.query.redirect,
//       client_id: req.query.client_id,
//       redirect_uri: req.query.redirect_uri
//     })
//   });
// //
// // // Post login.
//   app.post('/login', function(req, res) {
//     // @TODO: Insert your own login mechanism.
//     if (req.body.email !== 'thom@nightworld.com') {
//       // return render('login', {
//       //   redirect: req.body.redirect,
//       //   client_id: req.body.client_id,
//       //   redirect_uri: req.body.redirect_uri
//       // });
//       return res.json({
//         redirect: req.body.redirect,
//         client_id: req.body.client_id,
//         redirect_uri: req.body.redirect_uri
//       });
//     }
//
//     // Successful logins should send the user back to /oauth/authorize.
//     // var path = req.body.redirect || '/home';
//
//     // return res.redirect(util.format('/%s?client_id=%s&redirect_uri=%s', path, req.query.client_id, req.query.redirect_uri));
//     return res.json("format");
//   });

  // return app;
};
