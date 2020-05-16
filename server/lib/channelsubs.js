const channelsubs = async (req, res, User, ChannelSub, Channel) => {
  const { loginToken } = req.query;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  ChannelSub.findAll({
    where: { uid: user.id },
    include: { model: Channel },
    // order: [["id", "DESC"]],
  }).then((subs) => {
    res.json(subs);
  });
};

module.exports = { channelsubs };
