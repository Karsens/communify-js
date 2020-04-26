const { saveImageIfValid } = require("./util");
const update = async (req, res, User) => {
  const { loginToken, name, image, bio } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  let update = {};

  const { pathImage, pathThumbnail, invalid } = saveImageIfValid(
    res,
    image,
    true
  );
  if (invalid) return;

  if (pathImage && pathThumbnail) {
    update.image = pathImage;
    update.thumbnail = pathThumbnail;
  }

  if (name) {
    update.name = name;
  }

  if (bio) {
    update.bio = bio;
  }

  await User.update(update, { where: { loginToken } });
  res.json({ response: "Profile updated" });
};

module.exports = { update };
