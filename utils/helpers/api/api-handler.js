import { errorHandler, jwtMiddleware, corsMiddleware } from ".";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
    methods: ["GET", "HEAD", "POST", "DELETE", "PUT"],
});

export { apiHandler };

function apiHandler(handler) {
    return async (req, res) => {
        const method = req.method.toLowerCase();

        // check handler supports HTTP method
        if (!handler[method]) return res.status(405).end(`Method ${req.method} Not Allowed`);

        try {
            // global middleware
            await corsMiddleware(req, res, cors);
            await jwtMiddleware(req, res);
            // loggerMiddleware();

            // route handler
            await handler[method](req, res);
        } catch (err) {
            // global error handler
            errorHandler(err, res);
        }
    };
}
