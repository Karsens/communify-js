const update = async (req, res, User) => {
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

  if (image) {
    update.image = image;
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
