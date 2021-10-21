const { body } = require("express-validator");

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

const todoCreateRouteValidators = [
    body("title").exists().notEmpty(),
    body("completed").default(false)
]

module.exports = {
    registerRouteValidators,
    tokenRouteValidators,
    todoCreateRouteValidators
}