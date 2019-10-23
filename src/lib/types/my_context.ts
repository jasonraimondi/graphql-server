import { Request, Response } from "express";

import { InversifyContainer } from "@/lib/inversify_container";

export interface MyContext {
    req: Request|any;
    res: Response|any;
    auth?: {
        userId: string,
        email: string,
        isEmailConfirmed: boolean,
    };
    container: InversifyContainer;
}