const { Op } = require("sequelize");
const { publicUserFields } = require("./util");
const posts = (req, res, User, Franchise, Post) => {
  const { fid } = req.query;

  Post.findAll({
    where: { fid },
    include: { model: User, attributes: publicUserFields },
    order: [["id", "DESC"]],
  }).then((fr) => {
    res.json(fr);
  });
};

module.exports = { posts };
