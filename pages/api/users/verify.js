import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";
var crypto = require("crypto");
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

const sendVerifyCode = async (req, res) => {
    const { db } = await connectToDatabase();

    const { email } = req.body;

    // return users without hashed passwords in the response
    const verifyCode = crypto.randomBytes(20).toString('hex');
    const user = await db.collection("users").findOne({ email: email });
    if (!user) throw "User Not Found";

    const updated = await db.collection("users").updateOne({ _id: new ObjectId(user._id) }, { $set: { verifyCode: verifyCode } });
    if (!updated) throw `Something went wrong!!`;
    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: process.env.mailUsername,
            pass: process.env.mailPassword,
        },
        secure: true,
    });
    const mailData = {
        from: process.env.mailUsername,
        to: email,
        subject: `Account verification`,
        text: `Hi ${user.username},
        Glad to have you on UniBond. We need to verify that its you. Please click on the link below.`,
        html: `<div>
                <p>Hi ${user.username},</p>
                <p>Glad to have you on UniBond. We need to verify that its you. Please click on the link below.</p>
                <p>${process.env.apiUrl}?code=${verifyCode}&id=${user._id}</p>
        </div>`
    };
    transporter.sendMail(mailData, function (err, info) {
        if(err) {
            console.log(err)
            throw 'Something went wrong';
        } else {
            console.log(info)
            res.status(200).end();
        }
    });
};

const updateStatus = async (req, res) => {
    const { db } = await connectToDatabase();

    const { code, id } = req.body;
    const user = await db.collection("users").findOne({ _id: new ObjectId(id), verifyCode: code });
    if (!user) throw "Wrong Verifocation link";

    const updated = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { verifyCode: '', verified: true } });
    if (!updated) throw `Something went wrong!!`;
    res.status(200).end();
}

export default apiHandler({
    patch: sendVerifyCode,
    post: updateStatus
});
