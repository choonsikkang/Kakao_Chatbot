const express = require("express");
const app = express();
const db = require("./models");
const logger = require("morgan");
const port = 3000;

// const indexRouter = require("./main/index");

db.sequelize
    .sync()
    .then(() => {
        console.log("db 연결 성공 ");
    })
    .catch(console.error);

app.use(express.json());
app.use(logger("dev", {}));
app.use(
    express.urlencoded({
        extended: true
    })
);

// Main Route
app.use(require("./main"));
// app.use("/", indexRouter);

app.listen(port, () => {
    console.log(`Example skill server listening on ${port}!`);
});
