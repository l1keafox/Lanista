
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async(req, res, next) => {
  //  const token = req.header('Authorization').replace('Bearer ', '');
    // So the issue is that authormization header doesn't exist? so why does it look for it. 
//    const data = jwt.verify(token, process.env.JWT_KEY);
    // here we are verifying the data.
    try {
        // console.log('trying',req.id );
        // const user = await User.findOne({ _id: data._id  })
        // console.log(user,"USER?");
        // if (!user) {
        //     throw new Error()
        // }
        //console.log(user);
        //req.user = user
        // req.token = token
        // console.log(req.token);
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth