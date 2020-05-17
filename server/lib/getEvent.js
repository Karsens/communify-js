const { Op } = require("sequelize");
const { publicUserFields } = require("./util");

const getEvent = async (req, res, User, Franchise, Event, EventSub) => {
  const { fid, id } = req.query;

  const event = await Event.findOne({
    where: { fid, id },
    include: { model: User, attributes: publicUserFields },
  });

  if (!event) {
    res.json({ response: "Event not found" });
    return;
  }

  const participants = EventSub.findAll({
    where: { eventId: event.id },
    include: { model: User, attributes: publicUserFields },
  });

  res.json({ event, participants });
};

module.exports = { getEvent };
