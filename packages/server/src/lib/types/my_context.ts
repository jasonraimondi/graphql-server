import { Request, Response } from "express";

import { InversifyContainer } from "@/lib/inversify_container";

export interface MyContext {
    req: Request|any;
    res: Response|any;
    payload?: { userId: string };
    container: InversifyContainer;
}