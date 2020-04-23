const { Sequelize } = require("sequelize");
const { publicUserFields } = require("./util");

const profile = (req, res, User) => {
  const { name } = req.query;
  User.findOne({
    attributes: publicUserFields,
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", name)
      ),
    },
  }).then(async (user) => {
    res.json(user);
  });
};

module.exports = { profile };
