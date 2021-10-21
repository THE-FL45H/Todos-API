require("dotenv").config();
const { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_FORBIDDEN, HTTP_CREATED, HTTP_UNAUTHORIZED } = require("../utils/status_codes");
const router = require("express").Router();
const db = require("../models");
const { registerRouteValidators, tokenRouteValidators } = require("../middlewares/validators");
const { ValidatorResponse } = require("../middlewares");
const { RenderErrors, Token, CheckIfUserExists, GenerateUserPayload } = require("../utils");
const jwt = require("jsonwebtoken");
const keys = require("../config");
const { userExists, UserExists, VerifyToken } = require("../middlewares/auth");

router.get("/",
    VerifyToken,
    (req, res) => {
        res.send("Start of accounts");
    })

router.post("/register",
    ...registerRouteValidators, // check if body is well formed
    ValidatorResponse, // must be placed after validators
    async (req, res) => {
        const User = db.User;
        const { username, password, firstName, lastName, email, } = req.body;
        try {
            const user = await User.create({
                username, firstName, lastName, password, email,
            });
            const payload = GenerateUserPayload(user);

            const token = new Token(payload);
            const response = {
                username: user.username,
                email: user.email,
                access: token.createAccess(),
                refresh: token.createRefresh()
            }

            res.status(HTTP_CREATED).json(response);

        } catch (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).json({
                details: RenderErrors(err.errors)
            });
        }
    })

router.post("/token",
    ...tokenRouteValidators,
    ValidatorResponse,
    UserExists, // Aattaches user to request object: req.user
    (req, res) => {
        /**
        @body {
            "username": "",
            "password": "",
        }
        @response {
            "access": "",
            "refresh": ""
        }
        */
        const user = req.user;
        const payload = GenerateUserPayload(user);
        const tokenGenerator = new Token(payload);
        const response = {
            access: tokenGenerator.createAccess(),
            refresh: tokenGenerator.createRefresh()
        }
        res.json(response);
    })

router.post("/token/refresh",
    (req, res) => {
        /**
        @body {
            refresh: ""
        }
        @response {
            access: "",
            refresh: "",
        }
        */
        const { refresh } = req.body;
        if (!refresh) {
            return res.status(HTTP_BAD_REQUEST).json({
                details: "Missing refresh token"
            });
        } else {
            const payload = Token.verify(refresh, "refresh");
            if (payload !== null) {
                const tokenGenerator = new Token(payload);
                return res.json({
                    access: tokenGenerator.createAccess(),
                    refresh: tokenGenerator.createRefresh(),
                });
            } else {
                res.status(HTTP_UNAUTHORIZED).json({
                    "details": "Invalid token"
                });
            }
        }

    })

module.exports = router;