const folder = (req, res, User, Franchise, Folder) => {
  let { fid, parentId } = req.query;

  if (!fid) {
    res.json({ response: "Invalid fid" });
    return;
  }

  if (!parentId) {
    parentId = null;
  }

  Folder.findAll({
    where: { fid, parentId },
    order: [["name", "ASC"]],
  }).then((folder) => {
    res.json(folder);
  });
};

module.exports = { folder };
