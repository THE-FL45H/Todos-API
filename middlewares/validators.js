const { body, validationResult } = require("express-validator");

const registerRouteValidators = [
    body("username").exists().notEmpty(),
    body("firstName").exists(),
    body("lastName").exists(),
    body("password").exists(),
    body("email").exists().isEmail().normalizeEmail(),
];

const tokenRouteValidators = [
    body("username").exists(),
    body("password").exists()
];

module.exports = {
    registerRouteValidators,
    tokenRouteValidators
}