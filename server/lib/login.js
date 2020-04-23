const { Sequelize } = require("sequelize");
const md5 = require("md5");

const login = async (req, res, User) => {
  const { email, password } = req.body;

  if (!email) {
    res.json({ response: "Please fill in an email" });
  }
  if (!password) {
    res.json({ response: "Please fill in a password" });
  }

  const user = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("email")),
        Sequelize.fn("lower", email)
      ),
      password: md5(password),
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
