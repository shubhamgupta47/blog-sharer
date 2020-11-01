exports.getUser = (req, res) => {
  const { role, email, name, createdAt, updatedAt } = req.profile;
  return res.json({ role, email, name, createdAt, updatedAt });
};
