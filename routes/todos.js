const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Start of todos");
})

module.exports = router;