const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try { 
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log(`user is not authorized !\n`);
     return res
      .status(401)
      .json({ message: `user is not authorized !\n`  });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error.message);
    return res
      .status(401)
      .json({ message: `user is not authorized !\n` + error.message });
  }
};
