import { Request, Response } from "express";
import { Container } from "@/inversify";

export interface MyContext {
    req: Request;
    res: Response;
    payload?: { userId: string };
    container: Container;
}