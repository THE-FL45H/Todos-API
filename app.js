require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const { accountsRouter, todosRouter } = require("./routes");
const db = require("./models");

try {
    db.sequelize.sync();
} catch (e) {
    console.log("Could not connect to database");
}

app.use(express.json({
    limit: "100mb"
}));
app.use(express.urlencoded({ extended: false, limit: "100mb" }));
app.use(cors());
app.use(helmet());

app.use("/api/v1/accounts", accountsRouter);
app.use("/api/v1/todos", todosRouter);

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
});