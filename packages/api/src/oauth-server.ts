// import OAuth2Server, { Request, Response } from "oauth2-server";
//
// const oauth = new OAuth2Server({
//   model: require("./model"),
// });
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
