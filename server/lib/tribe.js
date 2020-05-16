const { Op } = require("sequelize");
const tribe = async (req, res, User, Tribe) => {
  const { slug } = req.query;
  const tribe = await Tribe.findOne({
    where: { slug },
  });

  //also retreive desinations

  res.json(tribe);
};

module.exports = { tribe };
