import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";

@controller("/")
export class HomeController {
    @httpGet("/")
    async refreshToken(_req: Request, res: Response) {
        res.redirect("/graphql");
    }
}
