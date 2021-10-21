const { User } = require("../models");
const { Token, GetTokenFromString } = require("../utils");
const { HTTP_FORBIDDEN, HTTP_UNAUTHORIZED } = require("../utils/status_codes");

const UserExists = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({
        where: { username, password },
    });
    if (user) {
        req.user = user;
        return next();
    }
    return res.status(HTTP_FORBIDDEN).json({
        details: "Incorrect credentials",
    });
}

const VerifyToken = async (req, res, next) => {
    const accessToken = GetTokenFromString(req.headers.authorization);
    const user = await Token.verify(accessToken, type = "access");
    if (user === null) {
        res.status(HTTP_UNAUTHORIZED).json({
            details: "Unauthorized"
        });
    } else {
        req.user = user;
        next();
    }
}

module.exports = {
    UserExists,
    VerifyToken
}