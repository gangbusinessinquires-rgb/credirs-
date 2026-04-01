const router = require("express").Router()
const db = require("../db")

router.get("/user/:id", async (req, res) => {

    const user = await db.query(
        "SELECT * FROM users WHERE discord_id=$1",
        [req.params.id]
    )

    const servers = await db.query(
        "SELECT * FROM servers WHERE discord_id=$1",
        [req.params.id]
    )

    res.json({
        user: user.rows[0],
        servers: servers.rows
    })
})

module.exports = router
