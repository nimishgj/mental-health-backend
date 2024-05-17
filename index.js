const Database = require("./config/Database");
const { createServer } = require("./util/Server");
require('dotenv').config();

const config = require('./config/' + process.env.NODE_ENV);

const app = createServer();

const db = new Database(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

db.connect().catch((err) =>
    console.error("Error connecting to database:", err)
);

app.listen(config.NODE_PORT, () => {
    console.log(
        "Server is running on port: ",
        config.NODE_PORT,
        "\nVersion 2.0 Powering Up\nPowered Up.."
    );
});
    