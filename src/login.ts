import { Arg, Resolver, Mutation, Ctx, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "./entity.user";
import { MyContext } from "./types";
import { loggerMiddleware } from "./logger";
import { LoginResponse } from "./login-response";

@Resolver()
export class LoginResolver {
    @UseMiddleware(loggerMiddleware)
    @Mutation(() => LoginResponse)
    async login(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() ctx: MyContext,
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { username } });
        // if we can't find a user return an obscure result (null) to prevent fishing
        if (!user) {
            return {
                errors: [{ field: "username", message: "Error logging in. Please try again." }],
            };
        }

        const valid = await bcrypt.compare(password, user.password);

        // if the supplied password is invalid return early
        if (!valid) {
            return {
                errors: [{ field: "username", message: "Invalid credentials." }],
            };
        }

        // if the user has not confirmed via email
        if (!user.confirmed) {
            return {
                errors: [{ field: "username", message: "Please confirm your account." }],
            };
            // return null;
        }

        // all is well return the user we found
        ctx.req.session!.userId = user.id;
        ctx.userId = user.id;
        return {
            user: user,
        };
    }
}
