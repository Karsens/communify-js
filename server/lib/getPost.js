const { Op } = require("sequelize");
const { publicUserFields } = require("./util");

const getPost = async (req, res, User, Franchise, Post, Comment) => {
  const { fid, id } = req.query;

  const post = await Post.findOne({
    where: { fid, id },
    include: { model: User, attributes: publicUserFields },
  });

  if (!post) {
    res.json({ response: "Post not found" });
    return;
  }
  const comments = await Comment.findAll({
    where: { pid: id },
    include: { model: User, attributes: publicUserFields },
  });

  res.json({ post, comments });
};

module.exports = { getPost };
