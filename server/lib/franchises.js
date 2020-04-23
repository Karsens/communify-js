const { Op } = require("sequelize");
const franchises = (req, res, User, Franchise) => {
  Franchise.findAll({
    where: {},
  }).then((fr) => {
    res.json(fr);
  });
};

module.exports = { franchises };
