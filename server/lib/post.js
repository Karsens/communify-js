const fs = require("fs");
const Jimp = require("jimp");

const { Op } = require("sequelize");
const post = async (req, res, User, Franchise, Post, Comment) => {
  const { loginToken, message, image } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  let pathImage = "";
  if (image) {
    // to declare some path to store your converted image
    const path = "./uploads/" + Date.now() + ".png";
    // to convert base64 format into random filename
    const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, "");

    fs.writeFileSync(path, base64Data, { encoding: "base64" });

    Jimp.read(path, (err, image) => {
      if (err) throw err;
      image
        .scaleToFit(512, 512) // resize
        .write(path); // save
    });

    pathImage = path.substring(1);
  }

  Post.create({ uid: user.id, fid: user.fid, post: message, image: pathImage });

  res.json({ response: "Post created", success: true });
};

module.exports = { post };