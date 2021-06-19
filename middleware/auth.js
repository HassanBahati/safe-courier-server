const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  //check for token
  if (!token) return res.status(401).json({ msg: "no token, auth denied" });

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "bahati");

    //add user prom paylad
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "token is not valid" });
  }
}

module.exports = auth;
