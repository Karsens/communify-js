const { saveImageIfValid, saveFileIfValid } = require("./util");

const createFolderItem = async (req, res, User, Franchise, Folder) => {
  let { loginToken, fid, parentId, name, image, file, type, text } = req.body;

  const typesAllowed = ["youtube", "folder", "mp3", "image", "text"];

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  if (user.level < 5 || user.fid !== fid) {
    res.json({ response: "Unauthorized" });
    return;
  }

  if (!fid) {
    res.json({ response: "Invalid fid" });
    return;
  }

  if (!parentId) {
    parentId = null;
  }

  const parent = await Folder.fineOne({ fid, id: parentId, type: "folder" });

  if (!parent) {
    res.json({ response: "Invalid location" });
    return;
  }
  if (!typesAllowed.includes(type)) {
    res.json({ response: "Invalid type" });
    return;
  }

  if (!name) {
    res.json({ response: "Invalid name" });
    return;
  }

  const { pathImage, invalid } = saveImageIfValid(res, image, false);
  if (invalid) return;

  if (!text) {
    text = null;
  }

  let fileUploaded = {};
  if (type === "image") {
    fileUploaded = saveImageIfValid(res, file, true);

    if (invalid) return;
  } else {
    fileUploaded = saveFileIfValid(res, file);
    if (invalid) return;
  }

  const created = await Folder.create({
    fid,
    parentId,
    name,
    image: pathImage,
    file: type === "image" ? fileUploaded.pathImage : fileUploaded.pathFile,
    thumbnail: type === "image" ? fileUploaded.pathThumbnail : undefined,
    text,
    type,
  });

  res.json({ response: "Created", parentId: created.id });
};

module.exports = { createFolderItem };
