const router = require("express").Router()
const db = require("../db")

router.post("/watch-ad", async (req, res) => {

    const discord_id = req.body.discord_id

    let credits = 10

    if (process.env.TESTING_MODE === "true") {
        credits = 100
    }

    await db.query(
        `
        UPDATE users
        SET credits = credits + $1
        WHERE discord_id = $2
        `,
        [credits, discord_id]
    )

    res.json({
        success: true,
        added: credits
    })
})

module.exports = router
