const { Sequelize } = require("sequelize");
const md5 = require("md5");
const fs = require("fs");
const Jimp = require("jimp");

const { isEmail } = require("./util");

const signupFranchise = async (req, res, User, Franchise) => {
  const { email, password, franchise, username, image } = req.body;

  if (!franchise) {
    res.json({ response: "Community name is mandatory" });
    return;
  }

  if (!email) {
    res.json({ response: "Email is mandatory" });
    return;
  }

  if (!isEmail(email)) {
    res.json({ response: "Incorrect email" });
    return;
  }

  if (!password || password.length < 6) {
    res.json({ response: "Password requires a minimum of 6 letters" });
    return;
  }

  const slug = franchise.toLowerCase().replace(" ", "-");

  const alreadyFranchise = await Franchise.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("slug")),
        Sequelize.fn("lower", slug)
      ),
    },
  });

  if (alreadyFranchise) {
    res.json({ response: "There's already a community with that name" });
    return;
  }

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

  const createFranchise = await Franchise.create({ name: franchise, slug });

  const createdUser = await User.create({
    username,
    email,
    password: md5(password),
    loginToken: Math.round(Math.random() * 9999999999999).toString(),
    level: 10,
    image: path.substring(1),
    thumbnail: pathThumbnail.substring(1),
    fid: createFranchise.id,
  });

  res.json({
    slug,
    loginToken: createdUser.loginToken,
    response: `You're logged in on ${createdUser.email}`,
  });
};

module.exports = { signupFranchise };
