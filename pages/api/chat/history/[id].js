import { apiHandler } from "../../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";
import { ObjectId } from "mongodb";

const chatHistory = async (req, res) => {
    const { db } = await connectToDatabase();

    const { id } = req.query;

    const messages = await db
        .collection("messages")
        .aggregate([
            {
                $match: {
                    users: id
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [{
                            $eq: [ "$sender", id]
                        }, {$arrayElemAt: ['$users',1]}, "$sender"]
                    }
                }
            }
        ])
        .sort({ createdAt: 1 })
        .limit(5)
        .map(x => new ObjectId(x._id))
        .toArray();
    const response = await db.collection('members').find( { _id: { $in: messages } } ).toArray();

    res.status(200).json(response);
};

export default apiHandler({
    get: chatHistory,
});
