const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.header('Authorization');
  try {
    const data = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_KEY);
    const user = await User.findOne({ _id: data._id  })
    if (!user) {
        throw new Error()
    }
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};
module.exports = auth;
