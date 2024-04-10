const express = require("express");
const app = express();

const UserRoutes = require("./routes/UserRoutes");
const HabitRoutes = require("./routes/HabitRoutes");
const LogRoutes = require("./routes/LogRoutes");

const Database = require("./config/Database");
require('dotenv').config();

const config = require('./config/' + process.env.NODE_ENV);

const db = new Database(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

db.connect().catch((err) =>
    console.error("Error connecting to database:", err)
);

app.get("/", (request, response) => {
    response.status(200).send("Server is UP and Running,Refer the documentation for more information");
});

app.use(express.json());

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/habits", HabitRoutes);
app.use("/api/v1/logs", LogRoutes);

console.log(config)

app.listen(config.NODE_PORT, () => {
    console.log(
        "Server is running on port: ",
        config.port,
        "\nVersion 2.0 Powering Up\nPowered Up.."
    );
});
