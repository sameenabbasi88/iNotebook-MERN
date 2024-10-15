var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Aliisagoodb$oy';

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add it to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; //auth token wala user ajai req.user mai
        next(); //anyother middleware hoto wo chal jai
        //middleware:in between res and req
              //req:jo hm krtai
              //res:jo show hota
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


module.exports = fetchUser;