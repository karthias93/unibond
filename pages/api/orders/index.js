import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";
import nodemailer from "nodemailer";

var insertOrder = async (req, res) => {
    const { db } = await connectToDatabase();
    const { ...order } = req.body;

    await db.collection("orders").insertOne({...order, status: 'Pending', createdAt: Date.now()});
    await db.collection("notifications").insert({from: order.user, to: 'admin', message: `${order.name} have placed order for ${order.serviceName}`, link: '/order'});
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
        to: 'unibond12@gmail.com',
        subject: `Message From ${order.name}`,
        text: `${order.name} have placed order for ${order.serviceName} Kindly approve it if user have paid or contact for payment.`,
        html: `<div>${order.name} have placed order for ${order.serviceName} Kindly approve it if user have paid or contact for payment.</div>`
    };
    transporter.sendMail(mailData, function (err, info) {
        if(err) {
            console.log(err)
            throw 'Something went wrong';
        } else {
            console.log(info)
            res.status(201).end();
        }
    });
};

export default apiHandler({
    post: insertOrder,
});
