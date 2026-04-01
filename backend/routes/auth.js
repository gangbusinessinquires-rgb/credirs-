const router = require("express").Router()
const axios = require("axios")
const db = require("../db")

router.get("/login", (req, res) => {

    const url =
        "https://discord.com/api/oauth2/authorize" +
        "?client_id=" + process.env.DISCORD_CLIENT_ID +
        "&redirect_uri=" + process.env.DISCORD_REDIRECT +
        "&response_type=code&scope=identify"

    res.redirect(url)
})

router.get("/callback", async (req, res) => {

    const code = req.query.code

    const token = await axios.post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.DISCORD_REDIRECT
        })
    )

    const user = await axios.get(
        "https://discord.com/api/users/@me",
        {
            headers: {
                Authorization: "Bearer " + token.data.access_token
            }
        }
    )

    await db.query(
        `
        INSERT INTO users (discord_id, username, last_login)
        VALUES ($1,$2,NOW())
        ON CONFLICT (discord_id)
        DO UPDATE SET last_login = NOW()
        `,
        [user.data.id, user.data.username]
    )

    res.send("Logged in")
})

module.exports = router
