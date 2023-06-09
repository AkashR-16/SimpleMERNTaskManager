const express = require("express")
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const taskRoute = require("./routes/task")

// CHANGE URL TO localhost or Your network url
// if localhost not works then change it to 127.0.0.1
const serverUrl = "127.0.0.1"

mongoose.connect("mongodb://localhost:27017/tasklist")
    .then(() => console.log("Database connection successed!"))
    .catch((err) => {
        console.log(err)
    });

app.use(express.json())

app.use(cors())
app.options("*", cors())

// Testing route
app.get("/api/test", async (req, res) => {
    res.status(200).send("Test succesfully made!");
})

app.use("/api", taskRoute);

app.listen(8080, serverUrl, () => {
    console.log("Backend server running!");
})
