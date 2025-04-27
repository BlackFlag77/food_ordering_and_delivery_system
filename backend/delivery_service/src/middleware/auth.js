const jwt = require("jsonwebtoken");

// exports.authenticate = (role) => (req, res, next) => {
module.exports = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/, "");
  // const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    // if (role && decoded.role !== role) {
    //   return res.status(403).json({ error: "Not allowed!" });
    // }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
