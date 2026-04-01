const router = require("express").Router()
const db = require("../db")
const ptero = require("../services/pterodactyl")

router.post("/create", async (req, res) => {

    const { discord_id } = req.body

    const user = await db.query(
        "SELECT * FROM users WHERE discord_id=$1",
        [discord_id]
    )

    if (!user.rows.length)
        return res.send("User not found")

    const username = user.rows[0].username

    const count = await db.query(
        "SELECT COUNT(*) FROM servers WHERE discord_id=$1",
        [discord_id]
    )

    const number =
        parseInt(count.rows[0].count) + 1

    const password =
        `${username}${number}`

    const server =
        await ptero.createServer(
            username,
            discord_id,
            password,
            number
        )

    await db.query(
        `
        INSERT INTO servers
        (discord_id, ptero_server_id, password)
        VALUES ($1,$2,$3)
        `,
        [discord_id, server.id, password]
    )

    res.json({
        success: true,
        password,
        server
    })
})

module.exports = router
