const activate = async (req, res, User) => {
  const { activationToken } = req.body;

  if (activationToken) {
    const user = await User.update(
      { activated: true },
      { where: { activationToken, activated: false } }
    );

    if (user[0] === 1) {
      res.json({ response: "Gelukt" });
    } else {
      res.json({ response: "Deze link is ongeldig" });
    }
  }
};
module.exports = { activate };
