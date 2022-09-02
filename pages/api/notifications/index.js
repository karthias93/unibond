import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";
import { ObjectId } from "mongodb";

var getNotifications = async (req, res) => {
    const { db } = await connectToDatabase();
    const notifications = await db.collection("notifications").find({to: 'admin', seen: {$in: [null, false]}}).toArray();
    return res.status(200).json(notifications);
};

const updateNotifications = async (req, res) => {
    const { db } = await connectToDatabase();
    const { id, ...notification } = req.body;
    const updated = await db.collection("notifications").updateOne({ _id: new ObjectId(id) }, { $set:notification });
    if (!updated) throw `Something went wrong!!`;
    return res.status(200).end();
}

export default apiHandler({
    get: getNotifications,
    patch: updateNotifications
});
