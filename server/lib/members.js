const { Op } = require("sequelize");
const { publicUserFields } = require("./util");
const members = (req, res, User) => {
  //return coordinatesets that are located in a square of lat/lng

  const { order } = req.query;

  const validOrders = ["onlineAt"];
  const validOrder = validOrders.includes(order) ? order : validOrders[0];

  User.findAll({
    attributes: publicUserFields,
    order: [[validOrder, "DESC"]],
    limit: 100,
    where: {},
  }).then((user) => {
    res.json(user);
  });
};

module.exports = { members };
