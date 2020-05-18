const { Op } = require("sequelize");
const tribes = (req, res, User, Tribe, Destination) => {
  Tribe.findAll({
    include: { model: Destination },
  }).then((tr) => {
    res.json(tr);
  });
};

module.exports = { tribes };
