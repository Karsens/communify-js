const { saveImageIfValid } = require("./util");

const createDestination = async (
  req,
  res,
  { User, Franchise, Destination }
) => {
  const { loginToken, title, city, country, lat, lng, stay, date } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const destinationCreated = await Destination.create({
    fid: user.fid,
    tid: user.tid,
    title,
    city,
    country,
    lat,
    lng,
    stay,
    date,
  });

  res.json({
    response: "Destination created",
    success: true,
    destinationId: destinationCreated.id,
  });
};

module.exports = { createDestination };
