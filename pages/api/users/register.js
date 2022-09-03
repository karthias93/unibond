const bcrypt = require("bcryptjs");
var crypto = require("crypto");

import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";

var register = async (req, res) => {
    const { db } = await connectToDatabase();
    const { password, ...user } = req.body;

    const oldUser = await db.collection("users").findOne({ email: user.email });
    if (oldUser) throw `User with the username "${user.email}" already exists`;

    // hash password
    user.hash = bcrypt.hashSync(password, 10);
    user.verifCode = crypto.randomBytes(20).toString('hex');
    await db.collection("users").insertOne(user);
    return res.status(200).json({});
};

export default apiHandler({
    post: register,
});
