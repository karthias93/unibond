import { apiHandler } from "../../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";

var getNotifications = async (req, res) => {
    const { db } = await connectToDatabase();
    const { id } = req.query;
    const notifications = await db.collection("notifications").find({to: id, seen: {$in: [null, false]}}).toArray();
    return res.status(200).json(notifications);
};

export default apiHandler({
    get: getNotifications
});
