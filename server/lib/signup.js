const { Sequelize } = require("sequelize");
const md5 = require("md5");
const fs = require("fs");
const Jimp = require("jimp");

const { isEmail } = require("./util");

const signup = async (req, res, User, Franchise) => {
  const { email, password, fid, username, image } = req.body;

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

  if (!fid) {
    res.json({ response: "Forgot franchise" });
    return;
  }

  const franchise = await Franchise.findOne({ where: { id: fid } });
  if (!franchise) {
    res.json({ response: "That franchise doesn't exist" });
    return;
  }

  const already = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("email")),
        Sequelize.fn("lower", email)
      ),
      fid,
    },
  });

  const usernameAlready = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("username")),
        Sequelize.fn("lower", username)
      ),
      fid,
    },
  });

  if (already) {
    res.json({ response: "This email is already in use" });
    return;
  }
  if (usernameAlready) {
    res.json({ response: "This username is already in use" });
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

  const { dataValues } = await User.create({
    username,
    email,
    image: path.substring(1),
    thumbnail: pathThumbnail.substring(1),
    password: md5(password),
    loginToken: Math.round(Math.random() * 9999999999999).toString(),
    fid,
  });

  res.json({
    loginToken: dataValues.loginToken,
    response: `You're logged in on ${dataValues.email}`,
  });
};

module.exports = { signup };
