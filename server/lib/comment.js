const { saveImageIfValid } = require("./util");

const { Op } = require("sequelize");
const comment = async (req, res, User, Franchise, Post, Comment) => {
  const { loginToken, pid, message, image } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const post = await Post.findOne({ where: { id: pid, fid: user.fid } });

  if (!post) {
    res.json({ response: "Post not found" });
    return;
  }

  const { pathImage, invalid } = saveImageIfValid(res, image, false);
  if (invalid) return;

  Post.update(
    { numComments: post.numComments + 1 },
    { where: { id: post.id } }
  );

  Comment.create({
    uid: user.id,
    pid: post.id,
    comment: message,
    image: pathImage,
  });

  res.json({ response: "Comment added", success: true });
};

module.exports = { comment };
