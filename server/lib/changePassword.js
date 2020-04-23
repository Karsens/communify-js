const changePassword = async (req, res, User) => {
  const { token, password } = req.body;

  if (token) {
    const user = await User.update(
      { password },
      { where: { loginToken: token } }
    );
    if (user[0] === 1) {
      res.json({ success: "Wachtwoord veranderd" });
    } else {
      res.json({ error: "No correct token" });
    }
  } else {
    res.json({ error: "No correct token" });
  }
};

module.exports = { changePassword };
