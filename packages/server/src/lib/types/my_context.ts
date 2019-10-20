import { Request, Response } from "express";

import { InversifyContainer } from "@/lib/inversify_container";

export interface MyContext {
    req: Request;
    res: Response;
    payload?: { userId: string };
    container: InversifyContainer;
}