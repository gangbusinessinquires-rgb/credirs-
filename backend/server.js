require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")

const auth = require("./routes/auth")
const credits = require("./routes/credits")
const servers = require("./routes/servers")
const dashboard = require("./routes/dashboard")

require("./services/scheduler")

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static("public"))

app.use("/auth", auth)
app.use("/credits", credits)
app.use("/servers", servers)
app.use("/dashboard", dashboard)

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/index.html")
    )
})

app.listen(process.env.PORT, () => {
    console.log("Running on port " + process.env.PORT)
})
