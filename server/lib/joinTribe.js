const { Sequelize } = require("sequelize");
const { saveImageIfValid } = require("./util");

const joinTribe = async (
  req,
  res,
  { User, Tribe, TribeSub, Channel, ChannelSub, TribeSubRequest }
) => {
  const { id, loginToken } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  if (!id) {
    res.json({ response: "ID is mandatory" });
    return;
  }

  const tribe = await Tribe.findOne({ where: { id } });

  if (!tribe) {
    res.json({ response: "Can't find tribe" });
    return;
  }

  const alreadySub = await TribeSub.findOne({
    where: { uid: user.id, tid: tribe.id },
  });

  if (alreadySub) {
    res.json({ response: "You're already in this tribe" });
    return;
  }

  // if tribe is closed=false, join tribe
  // TODO: if tribe is closed=true, request join, create new chat

  const channel = await Channel.findOne({ where: { tid: tribe.id } });

  if (!channel) {
    res.json({ response: "Error; tribe doesn't have a channel" });
    return;
  }

  if (tribe.open) {
    const createTribeSub = await TribeSub.create({
      tid: tribe.id,
      uid: user.id,
    });

    const createChannelSub = await ChannelSub.create({
      uid: user.id,
      cid: channel.id,
    });

    if (!createTribeSub || !createChannelSub) {
      res.json({ response: "Couldn't create tribesub" });
      return;
    }

    res.json({ response: `Tribe joined` });
  } else {
    const createTribeSubRequest = await TribeSubRequest.create({
      tid: tribe.id,
      uid: user.id,
    });

    if (!createTribeSubRequest) {
      res.json({ response: "Couldn't create request" });
      return;
    }

    res.json({ response: "Requested to join" });
  }
};

module.exports = { joinTribe };
