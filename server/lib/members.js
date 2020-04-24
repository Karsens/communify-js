const { Op } = require("sequelize");
const { publicUserFields } = require("./util");
const members = (req, res, User) => {
  const { order, fid } = req.query;

  if (!fid) {
    res.json({ response: "no fid given" });
    return;
  }

  const validOrders = ["onlineAt"];
  const validOrder = validOrders.includes(order) ? order : validOrders[0];

  User.findAll({
    attributes: publicUserFields,
    order: [[validOrder, "DESC"]],
    limit: 100,
    where: { fid },
  }).then((user) => {
    res.json(user);
  });
};

module.exports = { members };
