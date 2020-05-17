const { Op } = require("sequelize");
const { publicUserFields } = require("./util");

const destinations = (req, res, User, Franchise, Destination) => {
  const { fid, tid } = req.query;

  Destination.findAll({
    where: { fid, tid },
    include: [{ model: User, attributes: publicUserFields }],
    order: [["id", "DESC"]],
  }).then((fr) => {
    res.json(fr);
  });
};

module.exports = { destinations };
