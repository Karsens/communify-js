const { Sequelize } = require("sequelize");
const md5 = require("md5");

const login = async (req, res, User) => {
  const { email, password, fid } = req.body;
  if (!fid) {
    res.json({ response: "Please fill in a franchise" });
    return;
  }

  if (!email) {
    res.json({ response: "Please fill in an email" });
    return;
  }
  if (!password) {
    res.json({ response: "Please fill in a password" });
    return;
  }

  const user = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("email")),
        Sequelize.fn("lower", email)
      ),
      password: md5(password),
      fid,
    },
  });

  if (user) {
    res.json({
      loginToken: user.loginToken,
      response: `You're logged in on ${user.email}`,
    });
  } else {
    res.json({ response: "Email/password don't match" });
  }
};

module.exports = { login };
