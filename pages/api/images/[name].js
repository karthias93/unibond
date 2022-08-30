import fs from "fs";
import path from "path";

export default function handler(req, res) {
    console.log(req.query.name)
  const imagePath = req.query.name;
  const filePath = path.resolve(".", `public/uploads/${imagePath}`);
  const imageBuffer = fs.readFileSync(filePath);
  res.setHeader("Content-Type", "image/jpg");
  return res.send(imageBuffer);
}