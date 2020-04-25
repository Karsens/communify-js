const fs = require("fs");
const Jimp = require("jimp");

const update = async (req, res, User, Franchise) => {
  const { loginToken, name, image, bio } = req.body;

  if (!loginToken) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  let update = {};

  if (image) {
    // to declare some path to store your converted image
    const path = "./uploads/" + Date.now() + ".png";
    const pathThumbnail = "./uploads/" + Date.now() + "tn.png";
    // to convert base64 format into random filename
    const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, "");

    fs.writeFileSync(path, base64Data, { encoding: "base64" });
    fs.writeFileSync(pathThumbnail, base64Data, { encoding: "base64" });

    Jimp.read(path, (err, image) => {
      if (err) throw err;
      image
        .scaleToFit(512, 512) // resize
        .write(path); // save
    });

    Jimp.read(pathThumbnail, (err, image) => {
      if (err) throw err;
      image
        .scaleToFit(100, 100) // resize
        .write(pathThumbnail); // save
    });

    update.image = path.substring(1);
    update.thumbnail = pathThumbnail.substring(1);
  }

  await Franchise.update(update, { where: { id: user.fid } });
  res.json({ response: "Updated" });
};

module.exports = { update };
