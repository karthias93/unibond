import formidable from "formidable";
import fs from "fs";

import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";
import { ObjectId } from "mongodb";

export const config = {
    api: {
      bodyParser: false
    }
};

const updateProfilepic = async (req, res) => {
    const { db } = await connectToDatabase();
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      await saveFile(files.file);
      const updated = await db.collection("users").updateOne({ _id: new ObjectId(fields.id) }, { $set: {profilePic: files.file.originalFilename.replace(/[^a-z0-9]/gi, '_').toLowerCase()} });
      if (!updated) throw `Something went wrong!!`;
      const response = await db.collection("users").findOne({ _id: new ObjectId(fields.id) });
      return res.status(200).json(response);
    });
};

const saveFile = async (file) => {
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(`./public/uploads/${file.originalFilename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`, data);
    await fs.unlinkSync(file.filepath);
    return;
};

export default apiHandler({
    post: updateProfilepic,
});