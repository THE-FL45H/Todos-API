const jwt = require("jsonwebtoken");
const { accessTokenLifeTime, refreshTokenLifeTime } = require("../config");
const keys = require("../config");
const { User } = require("../models");

const RenderErrors = (errors) => {
    try {
        return errors.map((err) => err.message);
    } catch (err) {
        return `${errors}`;
    }
}

const GenerateUserPayload = (user) => {
    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }
}

const GetTokenFromString = (tokenString) => {
    /**
    @params {
        tokenString: Bearer token
    }
    @return token
    */
    try {
        return tokenString.split(" ")[1].trim();
    } catch(err) {
        return null;
    }
}


class Token {
    static createToken(payload, secretKey, expiresIn) {
        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token;
    }

    static verify(token, type = "access") {
        let payload = null;
        jwt.verify(token, keys.secretKey, (err, decoded) => {
            if (err) return;
            // console.log("Decoded: ", decoded);
            if (decoded.type === type) {
                // payload = GenerateUserPayload(decoded);
                payload = User.findByPk(decoded.id);
            }
        });
        return payload;
    }

    constructor(payload) {
        this.payload = payload;
    }

    createAccess() {
        return Token.createToken(
            { ...this.payload, type: "access" },
            keys.secretKey,
            accessTokenLifeTime
        );
    }

    createRefresh() {
        return Token.createToken(
            { ...this.payload, type: "refresh" },
            keys.secretKey,
            refreshTokenLifeTime
        );
    }
}

module.exports = {
    RenderErrors,
    GenerateUserPayload,
    GetTokenFromString,
    Token
}