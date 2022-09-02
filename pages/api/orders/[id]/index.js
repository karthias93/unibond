import { apiHandler } from "../../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";
import { ObjectId } from "mongodb";

var getOrders = async (req, res) => {
    const { db } = await connectToDatabase();
    const { id, isMember } = req.query;
    const condition = isMember === 'true' ? {} : {user: id};
    const orders = await db.collection("orders").find(condition).toArray();
    return res.status(200).json(orders);
};

const updateOrder = async (req, res) => {
    const { db } = await connectToDatabase();
    const { id } = req.query;
    const { ...order } = req.body;
    const updated = await db.collection('orders').updateOne({ _id: new ObjectId(id) }, { $set: order });
    if (!updated) throw `Something went wrong!!`;
    const response = await db.collection('orders').findOne({ _id: new ObjectId(id) });
    await db.collection("notifications").insert({
        from: 'admin',
        to: response.user,
        message: `Your ${response.serviceName} service request has been ${order.status}`,
        link: '/order',
        seen: false
    });
    return res.status(200).end();

}

export default apiHandler({
    get: getOrders,
    patch: updateOrder
});
