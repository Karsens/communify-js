const { saveImageIfValid } = require("./util");

const post = async (req, res, User, Franchise, Post, Comment) => {
  const { loginToken, message, image } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const { pathImage, invalid } = saveImageIfValid(res, image, false);
  if (invalid) return;

  const postCreated = await Post.create({
    uid: user.id,
    fid: user.fid,
    post: message,
    image: pathImage,
  });

  res.json({ response: "Post created", success: true, pid: postCreated.id });
};

module.exports = { post };
