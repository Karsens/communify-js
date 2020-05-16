const { saveImageIfValid, publicUserFields } = require("./util");

const getChat = async (req, res, { User, ChannelSub, Chat }) => {
  const { loginToken, id } = req.query;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const isSub = await ChannelSub.findOne({ where: { cid: id, uid: user.id } });

  if (!isSub) {
    res.json({ response: "You're not part of this chat" });
    return;
  }

  Chat.findAll({
    where: { cid: id },
    order: [["id", "DESC"]],
    include: { model: User, attributes: publicUserFields },
    limit: 100,
  }).then((chat) => {
    res.json(chat);
  });
};

const postChat = async (req, res, { User, ChannelSub, Chat, sequelize }) => {
  const { loginToken, cid, message, image } = req.body;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  if (!message) {
    res.json({ response: "No message" });
    return;
  }

  if (!cid) {
    res.json({ response: "No cid" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const sub = await ChannelSub.findOne({ where: { cid, uid: user.id } });

  if (!sub) {
    res.json({ response: "You're not part of this chat" });
    return;
  }

  const { pathImage, invalid } = saveImageIfValid(res, image, false);
  if (invalid) return;

  const chatCreated = await Chat.create({
    uid: user.id,
    cid,
    message,
    image: pathImage,
  });

  const updateUnread = await sequelize.query(
    `UPDATE channelsubs SET unread=unread+1 WHERE cid=${cid} AND uid != ${user.id}`
  );
  const updateLastMessage = await sequelize.query(
    `UPDATE channelsubs SET lastmessage='${message}' WHERE cid=${cid}`
  );

  //   console.log(updateUnread, updateLastMessage);

  res.json({ response: "Chat created", success: true, chatId: chatCreated.id });
};

module.exports = { getChat, postChat };
