const { Sequelize } = require("sequelize");
const md5 = require("md5");
const { saveImageIfValid } = require("./util");

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

  const { pathImage, pathThumbnail, invalid } = saveImageIfValid(
    res,
    image,
    true
  );
  if (invalid) return;

  const createFranchise = await Franchise.create({ name: franchise, slug });

  const createdUser = await User.create({
    username,
    email,
    password: md5(password),
    loginToken: Math.round(Math.random() * 9999999999999).toString(),
    level: 10,
    image: pathImage,
    thumbnail: pathThumbnail,
    fid: createFranchise.id,
  });

  res.json({
    slug,
    loginToken: createdUser.loginToken,
    response: `You're logged in on ${createdUser.email}`,
  });
};

module.exports = { signupFranchise };
