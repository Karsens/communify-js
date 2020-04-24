const { Sequelize } = require("sequelize");
const { publicUserFields } = require("./util");

const profile = (req, res, User) => {
  const { username, fid } = req.query;
  User.findOne({
    attributes: publicUserFields,
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("username")),
        Sequelize.fn("lower", username)
      ),
      fid,
    },
  }).then(async (user) => {
    res.json(user);
  });
};

module.exports = { profile };
