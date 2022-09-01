import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";

const getDashboardData = async (req, res) => {
    const { db } = await connectToDatabase();

    const result = await db.collection("orders").aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }} }
    ]).toArray();
    const response = Object.assign(...result.map((val) => ({[val._id]: val.count})))

    return res.status(200).json(response);
};

export default apiHandler({
    get: getDashboardData,
});
