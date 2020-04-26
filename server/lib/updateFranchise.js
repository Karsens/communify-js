const { saveImageIfValid } = require("./util");

const update = async (req, res, User, Franchise) => {
  const { loginToken, name, image, bio } = req.body;

  if (!loginToken) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
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

  await Franchise.update(update, { where: { id: user.fid } });
  res.json({ response: "Updated" });
};

module.exports = { update };
