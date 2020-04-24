const { Sequelize } = require("sequelize");
const md5 = require("md5");
const { isEmail } = require("./util");

const signupFranchise = async (req, res, User, Franchise, Community) => {
  const { email, password, franchise, username } = req.body;

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

  const alreadyFranchise = await Franchise.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", franchise)
      ),
    },
  });

  if (alreadyFranchise) {
    res.json({ response: "There's already a community with that name" });
    return;
  }

  const slug = franchise.toLowerCase().replace(" ", "-");

  const createFranchise = await Franchise.create({ name: franchise, slug });

  const createCommunity = await Community.create({
    name: franchise,
    fid: createFranchise.id,
  });

  const createdUser = await User.create({
    username,
    email,
    password: md5(password),
    loginToken: Math.round(Math.random() * 9999999999999),
    level: 10,
    fid: createFranchise.id,
    coid: createCommunity.id,
  });

  res.json({
    loginToken: createdUser.loginToken,
    response: `You're logged in on ${createdUser.email}`,
  });
};

module.exports = { signupFranchise };
