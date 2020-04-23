const { publicUserFields } = require("./util");

const me = (req, res, User) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: "No token given" });
    return;
  }
  User.findOne({
    attributes: publicUserFields,
    where: { loginToken: token },
  })
    .then(async (user) => {
      if (user) {
        res.json(user);

        User.update({ onlineAt: Date.now() }, { where: { loginToken: token } });
      } else {
        res.json(null);
      }
    })
    .catch((e) => console.log(e));
};

module.exports = { me };
