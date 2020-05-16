const { publicUserFields } = require("./util");

const me = (req, res, User, TribeSub, Tribe) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: "No token given" });
    return;
  }
  User.findOne({
    attributes: publicUserFields,
    where: { loginToken: token },
  })
    .then(async (user) => {
      if (user) {
        const tribeSubs = await TribeSub.findAll({
          where: { uid: user.id },
          include: { model: Tribe },
        });

        const tribes = tribeSubs.map((sub) => sub.tribe);

        let userWithTribes = user.dataValues;
        userWithTribes.tribes = tribes;

        await User.update(
          { onlineAt: Date.now() },
          { where: { loginToken: token } }
        );

        res.json(userWithTribes);
      } else {
        res.json(null);
      }
    })
    .catch((e) => console.log(e));
};

module.exports = { me };
