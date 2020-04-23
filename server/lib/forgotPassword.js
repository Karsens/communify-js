const forgotPassword = async (req, res, User) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user) {
    const forgotPasswordToken = Math.round(Math.random() * 999999999);

    const msg = {
      to: email,
      from: EMAIL_FROM,
      subject: "Wachtwoord resetten mastercrimez.nl",
      text: `Klik op de link om je wachtwoord te resetten: https://mastercrimez.nl/#/RecoverPassword/${forgotPasswordToken}`,
    };

    //ES6
    sgMail.send(msg).then(() => {
      res.json({ success: "Check je mail om je wachtwoord te resetten" });
    }, console.error);
  } else {
    res.json({ error: "Email niet gevonden" });
  }
};

const forgotPassword2 = async (req, res) => {
  const { token, password } = req.body;

  const updated = await Users.update(
    { password },
    { where: { forgotPasswordToken: token } }
  );

  if (updated === 1) {
    res.json({ success: "Wachtwoord gereset" });
  } else {
    res.json({ error: "Email/token niet gevonden" });
  }
};

module.exports = { forgotPassword, forgotPassword2 };
