const { Op } = require("sequelize");
const { publicUserFields } = require("./util");

const meTribe = async (req, res, { User, Tribe, Destination, TribeSub }) => {
  const { slug, loginToken } = req.query;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const tribe = await Tribe.findOne({
    where: { slug },
    include: [
      { model: Destination },
      {
        model: TribeSub,
        include: { model: User, attributes: publicUserFields },
      },
    ],
  });

  if (tribe.tribesubs.find((tribeSub) => tribeSub.uid === user.id)) {
    const setTribeId = await User.update(
      { tid: tribe.id },
      { where: { id: user.id } }
    );

    res.json(tribe);
  } else {
    res.json({ response: "You're not a member" });
  }

  //also retreive desinations
};

module.exports = { meTribe };
