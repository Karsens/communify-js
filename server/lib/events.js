const { Op } = require("sequelize");
const { publicUserFields } = require("./util");
const events = (req, res, User, Franchise, Event) => {
  const { fid } = req.query;

  Event.findAll({
    where: { fid },
    include: [{ model: User, attributes: publicUserFields }],
    order: [["id", "DESC"]],
  }).then((fr) => {
    res.json(fr);
  });
};

module.exports = { events };
