const { Constants } = require("./constants");

const createFranchise = async (req, res, User, Franchise) => {
  const { name, image, password } = req.body;

  if (!name) {
    res.json({ response: "Give name" });
    return;
  }
  if (password !== Constants.PASSWORD) {
    res.json({ response: "Wrong password" });
    return;
  }

  //image is base64. use jimp and fs to save it and create thumbnail

  const imageUrl = "";
  const thumbnailUrl = "";

  const created = await Franchise.create({
    name,
    image: imageUrl,
    thumbnail: thumbnailUrl,
  });

  if (!created) {
    res.json({ response: "Something went wrong" });
  }

  res.json({ response: "Created" });
};

const deleteFranchise = async (req, res, User, Franchise) => {
  const { id, password } = req.body;

  if (!id) {
    res.json({ response: "Give id" });
    return;
  }
  if (password !== Constants.PASSWORD) {
    res.json({ response: "Wrong password" });
    return;
  }

  const franchise = await Franchise.findOne({
    where: { id },
  });

  const destroy = await franchise.destroy();

  if (!destroy) {
    res.json({ response: "Something went wrong" });
  }

  res.json({ response: "Deleted" });
};

module.exports = { createFranchise, deleteFranchise };
