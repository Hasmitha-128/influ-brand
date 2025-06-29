const userAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: No session" });
  }

  req.user = { id: req.session.userId };
  next();
};

export default userAuth;
