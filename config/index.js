require("dotenv").config();

module.exports = {
    secretKey: process.env.SECRET_KEY || "set SECRET_KEY env variable if you know whats good for you...lol. I'm not joking...DO IT",
    accessTokenLifeTime: "300s", // 5 minutes
    refreshTokenLifeTime: "1209600s", // two weeks
    authHeaderName: "Authorization",
    authHeaderPrefix: "Bearer"
}