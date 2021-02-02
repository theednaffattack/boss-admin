import { NextFunction, Response } from "express";
import { GraphQLResolveInfo, GraphQLArgs } from "graphql";
// import DataLoader = require("dataloader");

// import { user } from "./zapatos/schema";

interface GraphQlInputs {
    args: GraphQLArgs;
    info: GraphQLResolveInfo;
}

export interface MyContext {
    userId: string; // user.Selectable["id"];
    gqlOpts: GraphQlInputs;
    req: any; // Request;
    res: Response;
    next: NextFunction;
    usersLoader: any;
    connectionName: string;
}
