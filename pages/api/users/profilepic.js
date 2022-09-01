import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";
import { ObjectId } from "mongodb";

const updateProfilepic = async (req, res) => {
  const { db } = await connectToDatabase();
  console.log(req.body)
  const { isMember, id, ...file } = req.body;
  const table = isMember ? "members" : "users";
  const updated = await db.collection(table).updateOne({ _id: new ObjectId(id) }, { $set: {profilePic: file} });
  if (!updated) throw `Something went wrong!!`;
  const response = await db.collection(table).findOne({ _id: new ObjectId(id) });
  return res.status(200).json(response);
};

export default apiHandler({
    post: updateProfilepic,
});