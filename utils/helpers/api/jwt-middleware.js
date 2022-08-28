const { expressjwt: expressJwt } = require("express-jwt");
const util = require("util");
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
    const middleware = expressJwt({ secret: serverRuntimeConfig.secret, algorithms: ["HS256"] }).unless({
        path: [
            // public routes that don't require authentication
            "/api/users",
            "/api/users/register",
            "/api/users/authenticate",
            "/api/members",
            "/api/members/register",
            "/api/members/authenticate",
        ],
    });

    return util.promisify(middleware)(req, res);
}
