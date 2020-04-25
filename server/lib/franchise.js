const { Op } = require("sequelize");
const franchise = (req, res, User, Franchise) => {
  const { slug } = req.query;
  Franchise.findOne({
    where: { slug },
  }).then((fr) => {
    res.json(fr);
  });
};

module.exports = { franchise };
