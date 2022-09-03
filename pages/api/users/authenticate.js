const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
import getConfig from "next/config";

import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";

const { serverRuntimeConfig } = getConfig();

var authenticate = async (req, res) => {
    const { db } = await connectToDatabase();
    const { email, password } = req.body;
    const user = await db.collection("users").findOne({ email: email });
    console.log(user, password)
    // validate
    if (!(user && bcrypt.compareSync(password, user.hash))) {
        throw "Username or password is incorrect";
    }

    if (user.verified) {
        // create a jwt token that is valid for 7 days
        const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: "1d" });

        // return basic user details and token
        return res.status(200).json({
            id: user._id,
            username: user.username,
            token,
            isAdmin: user.isAdmin,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            emailNotification: user.emailNotification,
            profilePic: user.profilePic
        });
    } else {
        res.status(401);
        res.send({email: email});
    }
};

export default apiHandler({
    post: authenticate,
});
