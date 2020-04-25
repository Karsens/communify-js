const md5 = require("md5");

const changePassword = async (req, res, User) => {
  const { token, password, passwordOld } = req.body;

  if (!token || !password || !passwordOld) {
    res.json({ response: "Fill in all fields, please" });
    return;
  }

  const user = await User.update(
    { password: md5(password) },
    { where: { loginToken: token, password: md5(passwordOld) } }
  );

  if (user[0] === 1) {
    res.json({ response: "Password changed" });
  } else {
    res.json({ response: "Incorrect password" });
  }
};

module.exports = { changePassword };
