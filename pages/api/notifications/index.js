import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";

var getNotifications = async (req, res) => {
    const { db } = await connectToDatabase();
    const notifications = await db.collection("notifications").find({to: 'admin'}).toArray();
    return res.status(200).json(notifications);
};

export default apiHandler({
    get: getNotifications
});
