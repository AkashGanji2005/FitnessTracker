const isOwner = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    if (doc.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.doc = doc;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = isOwner;
