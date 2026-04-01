const cron = require("node-cron")
const db = require("../db")
const ptero = require("./pterodactyl")

cron.schedule("0 * * * *", async () => {

    console.log("Checking inactive users")

    const users = await db.query(
        "SELECT * FROM users"
    )

    for (let user of users.rows) {

        const last = new Date(user.last_login)
        const now = new Date()

        const diff =
            (now - last) /
            (1000 * 60 * 60 * 24)

        if (diff >= process.env.LOGIN_DAYS_LIMIT) {

            const servers = await db.query(
                `
                SELECT ptero_server_id
                FROM servers
                WHERE discord_id = $1
                `,
                [user.discord_id]
            )

            for (let s of servers.rows) {
                await ptero.suspendServer(
                    s.ptero_server_id
                )
            }
        }
    }
})
