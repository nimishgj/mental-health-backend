const express = require("express");
const app = express();

app.get("/", (request, response) => {
    response.status(200).send("Server is UP and Running");
});

app.listen(process.env.PORT, () => {
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
