require("dotenv").config()

const express = require("express")
const cors = require("cors")

const auth = require("./routes/auth")
const credits = require("./routes/credits")

require("./services/scheduler")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", auth)
app.use("/credits", credits)

app.get("/", (req, res) => {
    res.send("Pterodactyl Credit System Running")
})

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT)
})
