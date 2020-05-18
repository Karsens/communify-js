const tribe = async (req, res, { User, Tribe, Destination, TribeSub }) => {
  const { slug } = req.query;
  const tribe = await Tribe.findOne({
    where: { slug },
    include: [{ model: Destination }],
  });

  res.json(tribe);
};

module.exports = { tribe };
