const jwt = require('jsonwebtoken');
const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
                console.log("JWT verification failed:", err);
                return res.sendStatus(403);
            }
            console.log("Decoded JWT:", user);
            req.user = user;
            next();
        });
    } else {
        console.log("No authorization header");
        res.sendStatus(401);
    }
};

module.exports = {
    authenticateJwt,
    SECRET
}