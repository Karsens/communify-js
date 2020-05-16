const { Op } = require("sequelize");
const tribes = (req, res, User, Tribe) => {
  Tribe.findAll({
    where: {},
  }).then((tr) => {
    res.json(tr);
  });
};

module.exports = { tribes };
