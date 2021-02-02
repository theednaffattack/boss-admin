import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { LoginResolver } from "./login";

import { pubsub } from "./redis";

export const createSchema = (): Promise<GraphQLSchema> =>
    buildSchema({
        authChecker: ({ context: { req } }) => {
            // I can read context here
            // check permission vs what's in the db "roles" argument
            // that comes from `@Authorized`, eg,. ["ADMIN", "MODERATOR"]
            // return !!req.session.userId;
            return true;
        },
        dateScalarMode: "isoDate",
        pubSub: pubsub,
        resolvers: [LoginResolver],
    });
