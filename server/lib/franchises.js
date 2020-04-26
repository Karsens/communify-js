const { Op } = require("sequelize");
const franchises = (req, res, User, Franchise) => {
  console.log("load franchises");
  Franchise.findAll({
    where: {},
  }).then((fr) => {
    res.json(fr);
  });
};

module.exports = { franchises };
