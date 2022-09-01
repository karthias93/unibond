import { apiHandler } from "../../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";

var getNotifications = async (req, res) => {
    const { db } = await connectToDatabase();
    const { id } = req.query;
    const notifications = await db.collection("notifications").find({to: id}).toArray();
    return res.status(200).json(notifications);
};

export default apiHandler({
    get: getNotifications
});
