const update = async (req, res, User) => {
  const { loginToken, image, bio } = req.body;

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

  if (bio) {
    update.bio = bio;
  }

  if (loginToken) {
    const user = await User.update(update, { where: { loginToken } });
    res.json({ user });
  }
};

module.exports = { update };
