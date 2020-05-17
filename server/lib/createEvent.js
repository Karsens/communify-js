const { saveImageIfValid } = require("./util");

const createEvent = async (
  req,
  res,
  { User, Franchise, Event, EventSub, Channel, ChannelSub }
) => {
  const { loginToken, title, message, image, date } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const { pathImage, invalid } = saveImageIfValid(res, image, false);
  if (invalid) return;

  const eventCreated = await Event.create({
    uid: user.id,
    fid: user.fid,
    message,
    title,
    image: pathImage,
    date,
  });

  const eventSubCreated = await EventSub.create({
    uid: user.id,
    eventId: eventCreated.id,
  });

  const channelCreated = await Channel.create({
    fid: user.fid,
    // no tid?
    name: "Activity: " + title,
  });

  const channelSubCreated = await ChannelSub.create({
    uid: user.id,
    cid: channelCreated.id,
    unread: 1,
  });

  res.json({
    response: "Event created",
    success: true,
    eventId: eventCreated.id,
  });
};

module.exports = { createEvent };
