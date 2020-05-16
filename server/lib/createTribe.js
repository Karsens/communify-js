const { Sequelize } = require("sequelize");
const md5 = require("md5");
const { saveImageIfValid } = require("./util");

const { isEmail } = require("./util");

const createTribe = async (req, res, User, Tribe, Channel) => {
  const { tribe, image, tagline, bio, loginToken } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  if (!tribe) {
    res.json({ response: "Tribe name is mandatory" });
    return;
  }

  const slug = tribe.toLowerCase().replace(" ", "-");

  const alreadyTribe = await Tribe.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("slug")),
        Sequelize.fn("lower", slug)
      ),
    },
  });

  if (alreadyTribe) {
    res.json({ response: "There's already a tribe with that name" });
    return;
  }

  const { pathImage, pathThumbnail, invalid } = saveImageIfValid(
    res,
    image,
    true
  );

  if (invalid) return;

  const createTribe = await Tribe.create({
    fid: user.fid,
    name: tribe,
    slug,
    tagline,
    bio,
    image: pathImage,
    thumbnail: pathThumbnail,
  });

  const createChannel = await Channel.create({
    fid: user.fid,
    tid: createTribe.id,
    name: tribe,
  });

  if (!createTribe || !createChannel) {
    res.json({ response: "Something went wrong" });
    return;
  }

  res.json({
    slug,
    response: `Tribe created`,
  });
};

module.exports = { createTribe };
