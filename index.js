const express = require("express");
const app = express();

const UserRoutes = require("./routes/UserRoutes");
const Database = require("./config/Database");

require('dotenv').config();


const mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`

const db = new Database(mongoUri, {
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



app.listen(3000, () => {
    try {
        console.log(
            "Server is running on port: ",
            3000,
            "\nVersion 2.0 Powering Up\nPowered Up.."
        );
    } catch (error) {
        console.log(error);
    }
});
